from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Example API endpoint
@app.get("/api/data")
async def get_data():
    return {"message": "Hello from FastAPI!"}


# Serve the React app
current_dir = Path(__file__).parent.parent
build_dir = current_dir / "public"

app.mount(
    "/",
    StaticFiles(directory=build_dir, html=True),
    name="static",
)
