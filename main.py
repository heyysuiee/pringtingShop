from pathlib import Path

import fastapi
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = fastapi.FastAPI()
frontend_dir = Path(__file__).resolve().parent / "frontend"
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")


def render_page(page_name: str, active_page: str) -> HTMLResponse:
    layout = (frontend_dir / "layout.html").read_text(encoding="utf-8")
    content = (frontend_dir / page_name).read_text(encoding="utf-8")
    page = layout.replace("{{content}}", content)

    for page_id in ("home", "services", "works", "contact"):
        placeholder = f"__{page_id.upper()}_ACTIVE__"
        page = page.replace(placeholder, "active" if page_id == active_page else "")

    return HTMLResponse(page)


@app.get("/")
@app.get("/home")
def home():
    return render_page("home.html", "home")


@app.get("/services")
def services():
    return render_page("services.html", "services")


@app.get("/contact")
def contact():
    return render_page("contact.html", "contact")


@app.get("/finished-works")
def finished_works():
    return render_page("finished-works.html", "works")

@app.post("/admin")
def admin():
    return render_page("admin.html", "admin")