from pathlib import Path

import fastapi
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = fastapi.FastAPI()
frontend_dir = Path(__file__).resolve().parent / "frontend"
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")


@app.get("/home")
def read_home():
    home_page = frontend_dir / "home.html"
    return FileResponse(home_page)

