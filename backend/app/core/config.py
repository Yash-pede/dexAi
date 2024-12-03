# app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Job Search API"
    version: str = "1.0.0"

    class Config:
        env_file = ".env"

settings = Settings()
