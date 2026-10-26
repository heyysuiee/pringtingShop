from pathlib import Path

import fastapi
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from admin_routes import router as admin_router

app = fastapi.FastAPI()
project_dir = Path(__file__).resolve().parent
frontend_dir = project_dir / "frontend"
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")
app.include_router(admin_router)


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
def read_home():
    return render_page("home.html", "home")


@app.get("/services")
def read_services():
    return render_page("services.html", "services")


@app.get("/contact")
def read_contact():
    return render_page("contact.html", "contact")


@app.get("/finished-works")
def read_finished_works():
    return render_page("finished-works.html", "works")