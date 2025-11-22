from fastapi import FastAPI

from app.config import settings

app = FastAPI(title="API", version="0.0.1")

@app.get("/")
async def root():
    return {
        "message": settings.APP_DOMAIN,
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
