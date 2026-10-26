import base64
import hashlib
import hmac
import html
import json
import os
import time
from functools import lru_cache
from pathlib import Path
from typing import NamedTuple
from urllib.parse import parse_qs

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse

router = APIRouter()
module_dir = Path(__file__).resolve().parent
admin_dir = module_dir if (module_dir / "admin.html").is_file() else module_dir / "backend"
admin_session_cookie = "impression_admin_session"
admin_session_lifetime = 8 * 60 * 60
MAX_FORM_BYTES = 16_384
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_SECONDS = 300
ADMIN_COOKIE_PATH = "/"


# ----------------------------- configuration -------------------------------

class AdminConfig(NamedTuple):
    username: str
    password: str
    session_secret: bytes


def _read_setting(name: str) -> str:
    """Environment variable first, then the Windows user registry (for setx)."""
    value = os.environ.get(name, "")
    if value:
        return value
    try:
        import winreg

        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as key:
            return str(winreg.QueryValueEx(key, name)[0])
    except (ImportError, OSError):  # not Windows, or the value isn't set
        return ""


@lru_cache(maxsize=1)
def admin_configuration() -> AdminConfig | None:
    """Loaded once per app start. Restart the app after changing the variables."""
    username = _read_setting("ADMIN_USERNAME")
    password = _read_setting("ADMIN_PASSWORD")
    secret = _read_setting("ADMIN_SESSION_SECRET").encode("utf-8")
    if not username or not password or len(secret) < 32:
        return None
    return AdminConfig(username, password, secret)


# ------------------------------ login page ---------------------------------

def render_admin_login(
    message: str = "", *, not_configured: bool = False, status_code: int = 200
) -> HTMLResponse:
    page = (admin_dir / "admin.html").read_text(encoding="utf-8")
    setup_text = (
        "Admin access is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and "
        "a random ADMIN_SESSION_SECRET of at least 32 characters, then restart the app."
        if not_configured
        else "Your admin session is protected. Sign in with your admin credentials."
    )
    page = (
        page.replace("__ADMIN_MESSAGE__", html.escape(message))
        .replace("__ADMIN_MESSAGE_HIDDEN__", "" if message else "hidden")
        .replace("__ADMIN_SETUP_HIDDEN__", "" if not_configured else "hidden")
        .replace("__ADMIN_SETUP_MESSAGE__", setup_text)
    )
    return HTMLResponse(page, status_code=status_code, headers={"Cache-Control": "no-store"})


# ------------------------------- sessions ----------------------------------

def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64decode(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def _sign(secret: bytes, message: str) -> bytes:
    return hmac.new(secret, message.encode("ascii"), hashlib.sha256).digest()


def create_admin_session(username: str, session_secret: bytes) -> str:
    payload = json.dumps(
        {"sub": username, "exp": int(time.time()) + admin_session_lifetime},
        separators=(",", ":"),
    ).encode("utf-8")
    encoded_payload = _b64encode(payload)
    return f"{encoded_payload}.{_b64encode(_sign(session_secret, encoded_payload))}"


def has_admin_session(token: str | None) -> bool:
    config = admin_configuration()
    if not token or len(token) > 2048 or config is None:
        return False
    try:
        encoded_payload, encoded_signature = token.split(".", maxsplit=1)
        if not hmac.compare_digest(
            _b64decode(encoded_signature), _sign(config.session_secret, encoded_payload)
        ):
            return False
        payload = json.loads(_b64decode(encoded_payload))
        return (
            isinstance(payload, dict)
            and payload.get("sub") == config.username
            and type(payload.get("exp")) is int
            and payload["exp"] > int(time.time())
        )
    except ValueError:  # bad base64, bad JSON, and bad unicode are all ValueErrors
        return False


def require_admin(request: Request) -> None:
    """Use on admin-only API routes:
    @app.get("/api/admin/orders", dependencies=[Depends(require_admin)])
    """
    if not has_admin_session(request.cookies.get(admin_session_cookie)):
        raise HTTPException(status_code=401, detail="Admin login required.")


# --------------------------- login protection ------------------------------

_failed_attempts: dict[str, list[float]] = {}


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _is_locked_out(ip: str) -> bool:
    now = time.time()
    recent = [t for t in _failed_attempts.get(ip, []) if now - t < LOCKOUT_SECONDS]
    if recent:
        _failed_attempts[ip] = recent
    else:
        _failed_attempts.pop(ip, None)
    return len(recent) >= MAX_FAILED_ATTEMPTS


def _digest(value: str) -> bytes:
    # Hashing first means both sides are always 32 bytes, so length can't leak.
    return hashlib.sha256(value.encode("utf-8")).digest()


def _credentials_match(config: AdminConfig, username: str, password: str) -> bool:
    user_ok = hmac.compare_digest(_digest(username), _digest(config.username))
    pass_ok = hmac.compare_digest(_digest(password), _digest(config.password))
    return user_ok and pass_ok


async def _read_form(request: Request) -> dict[str, list[str]] | None:
    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > MAX_FORM_BYTES:
            return None
        body.extend(chunk)
    return parse_qs(body.decode("utf-8", errors="replace"))


# -------------------------------- routes -----------------------------------

@router.get("/admin")
def read_admin(request: Request):
    if has_admin_session(request.cookies.get(admin_session_cookie)):
        return RedirectResponse("/admin/dashboard", status_code=303)
    return render_admin_login(not_configured=admin_configuration() is None)


@router.get("/admin.css")
def read_admin_stylesheet():
    return FileResponse(admin_dir / "admin.css", media_type="text/css")


@router.post("/admin")
async def admin(request: Request):
    config = admin_configuration()
    if config is None:
        return render_admin_login(not_configured=True, status_code=503)

    ip = _client_ip(request)
    if _is_locked_out(ip):
        return render_admin_login(
            "Too many failed attempts. Please wait a few minutes and try again.",
            status_code=429,
        )

    form = await _read_form(request)
    if form is None:
        return HTMLResponse("Admin sign-in request is too large.", status_code=413)

    username = form.get("username", [""])[0]
    password = form.get("password", [""])[0]
    if not _credentials_match(config, username, password):
        _failed_attempts.setdefault(ip, []).append(time.time())
        return render_admin_login("The username or password is incorrect.", status_code=401)

    _failed_attempts.pop(ip, None)
    response = RedirectResponse("/admin/dashboard", status_code=303)
    response.set_cookie(
        admin_session_cookie,
        create_admin_session(config.username, config.session_secret),
        max_age=admin_session_lifetime,
        httponly=True,
        secure=request.url.scheme == "https",
        samesite="strict",
        path=ADMIN_COOKIE_PATH,
    )
    response.headers["Cache-Control"] = "no-store"
    return response


@router.get("/admin/dashboard")
def read_admin_dashboard(request: Request):
    if not has_admin_session(request.cookies.get(admin_session_cookie)):
        return RedirectResponse("/admin", status_code=303)
    return HTMLResponse(
        (admin_dir / "admin-dashboard.html").read_text(encoding="utf-8"),
        headers={"Cache-Control": "no-store"},
    )


@router.post("/admin/logout")
def admin_logout(request: Request):
    response = RedirectResponse("/admin", status_code=303)
    response.delete_cookie(
        admin_session_cookie,
        httponly=True,
        secure=request.url.scheme == "https",
        samesite="strict",
        path=ADMIN_COOKIE_PATH,
    )
    response.headers["Cache-Control"] = "no-store"
    return response