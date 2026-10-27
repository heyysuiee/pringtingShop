from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

project_dir = Path(__file__).resolve().parent
env_path = project_dir / ".env"
env_loaded = load_dotenv(env_path, override=True, encoding="utf-8-sig")

from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.responses import HTMLResponse, RedirectResponse  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

from admin_routes import admin_configuration, router as admin_router  # noqa: E402

frontend_dir = project_dir / "frontend"

if not frontend_dir.is_dir():
    raise RuntimeError(f"Frontend folder not found: {frontend_dir}")

PAGE_IDS = ("home", "services", "works", "contact")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if admin_configuration() is None:
        print("WARNING: admin login is not configured.")
        print(f"  .env path:        {env_path}")
        print(f"  .env file exists: {env_path.is_file()}")
        print(f"  .env loaded:      {env_loaded}")
        print("  Needs ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET (32+ characters).")
    else:
        print("Admin login is configured.")
    yield


app = FastAPI(lifespan=lifespan)
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")
app.include_router(admin_router)


def render_page(
    page_name: str,
    active_page: str,
    extra_page_name: str | None = None,
) -> HTMLResponse:
    try:
        layout = (frontend_dir / "layout.html").read_text(encoding="utf-8")
        content = (frontend_dir / page_name).read_text(encoding="utf-8")
        if extra_page_name:
            content += "\n" + (frontend_dir / extra_page_name).read_text(encoding="utf-8")
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Missing template file: {Path(error.filename).name}",
        )

    page = layout.replace("{{content}}", content)
    for page_id in PAGE_IDS:
        placeholder = f"__{page_id.upper()}_ACTIVE__"
        page = page.replace(placeholder, "active" if page_id == active_page else "")

    return HTMLResponse(page)


@app.get("/")
@app.get("/home")
def read_home():
    return render_page("home.html", "home")


@app.get("/services")
def read_services():
    return render_page("services.html", "services")


@app.get("/order")
def read_order():
    return render_page("order.html", "order")


@app.get("/how-to-order")
def read_how_to_order():
    return RedirectResponse("/contact#how-to-order")


@app.get("/contact")
def read_contact():
    return render_page("contact.html", "contact")


@app.get("/finished-works")
def read_finished_works():
    return render_page("finished-works.html", "works")
