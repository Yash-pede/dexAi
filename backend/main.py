from fastapi import FastAPI
from app.routes.messages import router as messages_router
from app.routes.job import router as jobs_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Job and Message API")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(messages_router, prefix="/api/messages", tags=["Messages"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
