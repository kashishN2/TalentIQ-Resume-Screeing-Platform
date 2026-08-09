import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session
from app.schemas.analysis import JobAnalysisResponse
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.services.analysis_service import AnalysisService
from app.services.job_service import JobService


router = APIRouter(
    prefix="/jobs",
    tags=["Analysis"],
)


def get_analysis_service(
    db: Session = Depends(get_db),
):
    return AnalysisService(db)


def get_job_service(
    db: Session = Depends(get_db),
):
    return JobService(db)


@router.post(
    "/{job_id}/analyze",
)
def analyze_job(
    job_id: uuid.UUID,
    current_user: User = Depends(
        get_current_user
    ),
    analysis_service: AnalysisService = Depends(
        get_analysis_service
    ),
    job_service: JobService = Depends(
        get_job_service
    ),
):

    job = job_service.get_job(
        job_id
    )

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    if job.created_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied.",
        )

    try:

        ranked_candidates = (
            analysis_service.analyze_job(
                job_id
            )
        )

        return {
            "job_id": str(job_id),
            "total_analyzed": len(
                ranked_candidates
            ),
            "candidates": [
                candidate.model_dump()
                for candidate
                in ranked_candidates
            ],
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}",
        )

@router.get(
    "/{job_id}/analysis",
    response_model=JobAnalysisResponse,
)
def get_job_analysis(
    job_id: uuid.UUID,
    current_user: User = Depends(
        get_current_user
    ),
    analysis_service: AnalysisService = Depends(
        get_analysis_service
    ),
    job_service: JobService = Depends(
        get_job_service
    ),
):

    job = job_service.get_job(
        job_id
    )

    if job is None:

        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    if job.created_by != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Access denied.",
        )

    return analysis_service.get_job_analysis(
        job_id
    )