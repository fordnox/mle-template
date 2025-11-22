from fastapi import FastAPI

app = FastAPI(title="API", version="0.0.1")

@app.get("/")
async def root():
    return {
        "message": "ok",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
