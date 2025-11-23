from fastapi import FastAPI

from app.core.config import settings
from app.routers import dashboard

app = FastAPI(title="API", version="0.0.1")

app.include_router(dashboard.router, prefix="/dashboard")


@app.get("/")
async def root():
    return {
        "message": settings.APP_DOMAIN,
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
