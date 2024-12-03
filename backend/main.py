# backend/main.py

from fastapi import FastAPI
from app.routes.job import router as job_router

app = FastAPI(title="Job API")

# Include job routes
app.include_router(job_router, prefix="/api/jobs", tags=["Jobs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
