import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.resume import (
    ResumeListResponse,
    ResumeResponse,
    UploadSummaryResponse,
)
from app.services.job_service import JobService
from app.services.resume_service import ResumeService

router = APIRouter(
    prefix="/jobs",
    tags=["Resumes"],
)
def get_resume_service(
    db: Session = Depends(get_db),
):
    return ResumeService(db)


def get_job_service(
    db: Session = Depends(get_db),
):
    return JobService(db)

@router.post(
    "/{job_id}/upload-resumes",
    response_model=UploadSummaryResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_resumes(
    job_id: uuid.UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service),
    job_service: JobService = Depends(get_job_service),
):

    job = job_service.get_job(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    if job.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to upload resumes for this job.",
        )

    return resume_service.upload_zip(
        job_id,
        file,
    )

@router.get(
    "/{job_id}/resumes",
    response_model=ResumeListResponse,
)
def get_resumes(
    job_id: uuid.UUID,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service),
    job_service: JobService = Depends(get_job_service),
):

    job = job_service.get_job(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    if job.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied.",
        )

    resumes = resume_service.get_resumes_by_job(
        job_id,
        skip,
        limit,
    )

    total = resume_service.count_resumes(job_id)

    return {
        "resumes": resumes,
        "total": total,
    }

@router.get(
    "/resumes/{resume_id}",
    response_model=ResumeResponse,
)
def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    resume_service: ResumeService = Depends(get_resume_service),
):

    resume = resume_service.get_resume(
        resume_id
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return resume