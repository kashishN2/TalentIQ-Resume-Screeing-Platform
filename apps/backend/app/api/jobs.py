import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.job import JobStatus
from app.models.user import User
from app.schemas.job import (
    JobCreate,
    JobListResponse,
    JobResponse,
    JobUpdate,
)
from app.services.job_service import JobService
router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)
def get_job_service(
    db: Session = Depends(get_db),
):
    return JobService(db)
@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job(
    job: JobCreate,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):
    try:
        return service.create_job(
            job,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail=str(e),
        )

@router.get(
    "",
    response_model=JobListResponse,
)
def get_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status_filter: JobStatus | None = Query(
        default=None,
        alias="status",
    ),
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):
    if status_filter:
        jobs = service.get_jobs_by_status(
            status_filter,
            skip,
            limit,
        )

        return {
            "jobs": jobs,
            "total": len(jobs),
        }

    return service.get_jobs(
        skip,
        limit,
    )

@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def get_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):

    job = service.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job

@router.put(
    "/{job_id}",
    response_model=JobResponse,
)
def update_job(
    job_id: uuid.UUID,
    update_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):

    job = service.get_job(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return service.update_job(
        job,
        update_data,
    )

@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):

    job = service.get_job(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    service.delete_job(job)