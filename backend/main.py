
from fastapi import FastAPI
from app.routes.job import router as job_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Job API")
origins = ['*']
app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

app.include_router(job_router, prefix="/api/jobs", tags=["Jobs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
