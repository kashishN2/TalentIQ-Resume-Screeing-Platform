from fastapi import FastAPI
from app.api.jobs import router as jobs_router
from app.api.auth import router as auth_router
from app.api.health import router as health_router
import app.core.storage

from app.api.resumes import (
    router as resume_router
)
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(
    title="TalentIQ API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(health_router)
app.include_router(jobs_router)
app.include_router(resume_router)