# app/repositories/__init__.py
from .user_repository import UserRepository
from .job_repository import JobRepository
from .resume_repository import ResumeRepository

__all__ = [
    "UserRepository",
    "JobRepository",
    "ResumeRepository",
]