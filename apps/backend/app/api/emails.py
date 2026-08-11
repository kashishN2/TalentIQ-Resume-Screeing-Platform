import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.email import (
    CandidateDecisionRequest,
    EmailResponse,
)
from app.services.email_service import EmailService
from app.services.resume_service import ResumeService
from app.services.job_service import JobService

router = APIRouter(
    prefix="/jobs",
    tags=["Emails"],
)


def get_email_service():
    return EmailService()


def get_resume_service(
    db: Session = Depends(get_db),
):
    return ResumeService(db)


def get_job_service(
    db: Session = Depends(get_db),
):
    return JobService(db)


@router.post(
    "/{job_id}/resumes/{resume_id}/decision",
    response_model=EmailResponse,
)
def send_candidate_decision(
    job_id: uuid.UUID,
    resume_id: uuid.UUID,
    request: CandidateDecisionRequest,
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service),
    job_service: JobService = Depends(get_job_service),
    email_service: EmailService = Depends(get_email_service),
):
    # Check job
    job = job_service.get_job(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    # Check ownership
    if job.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied.",
        )

    # Check resume
    resume = resume_service.get_resume(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    # Make sure resume belongs to this job
    if resume.job_id != job_id:
        raise HTTPException(
            status_code=400,
            detail="Resume does not belong to this job.",
        )

    # Candidate email is required
    if not resume.email:
        raise HTTPException(
            status_code=400,
            detail="Candidate email is not available.",
        )

    try:
        email_service.send_candidate_decision(
            candidate_email=resume.email,
            candidate_name=resume.candidate_name,
            job_title=job.title,
            decision=request.decision.value,
        )

        return {
            "success": True,
            "recipient": resume.email,
            "decision": request.decision,
            "message": "Candidate decision email sent successfully.",
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(exc)}",
        )

smtp_router = APIRouter(
    prefix="/smtp",
    tags=["SMTP Diagnostics"],
)


@smtp_router.get("/test")
def smtp_test(
    current_user: User = Depends(get_current_user),
):
    import socket

    try:
        connection = socket.create_connection(
            (settings.SMTP_HOST, settings.SMTP_PORT),
            timeout=10,
        )
        connection.close()

        return {
            "smtp_reachable": True,
            "host": settings.SMTP_HOST,
            "port": settings.SMTP_PORT,
        }

    except Exception as exc:
        return {
            "smtp_reachable": False,
            "host": settings.SMTP_HOST,
            "port": settings.SMTP_PORT,
            "error": str(exc),
        }