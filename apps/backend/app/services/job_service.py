import uuid

from sqlalchemy.orm import Session

from app.models.job import Job, JobStatus
from app.models.user import User
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobUpdate
class JobService:

    def __init__(self, db: Session):
        self.repo = JobRepository(db)
    def create_job(
        self,
        job_data: JobCreate,
        current_user: User,
    ) -> Job:
    
        job = Job(
            title=job_data.title,
            department=job_data.department,
            location=job_data.location,
            employment_type=job_data.employment_type,
            experience_min=job_data.experience_min,
            experience_max=job_data.experience_max,
            description=job_data.description,
            required_skills=job_data.required_skills,
            minimum_score=job_data.minimum_score,
            status=JobStatus.OPEN,
            created_by=current_user.id,
        )
        existing_job = self.repo.get_by_title(
            job_data.title
        )
        
        if existing_job:
            raise ValueError(
                "Job already exists."
            )
        return self.repo.create(job)
    def get_job(
        self,
        job_id: uuid.UUID,
    ):
    
        return self.repo.get_by_id(job_id)
    def get_jobs(
        self,
        skip: int,
        limit: int,
    ):
     
        jobs = self.repo.get_all(skip, limit)
     
        total = self.repo.count()
     
        return {
            "jobs": jobs,
            "total": total,
        }
    def get_jobs_by_status(
        self,
        status: JobStatus,
        skip: int,
        limit: int,
    ):
    
        jobs = self.repo.get_by_status(
            status,
            skip,
            limit,
        )
    
        return jobs
    def update_job(
        self,
        job: Job,
        update_data: JobUpdate,
    ):
    
        update_dict = update_data.model_dump(
            exclude_unset=True
        )
    
        for key, value in update_dict.items():
            setattr(
                job,
                key,
                value,
            )
    
        return self.repo.update(job)
    def delete_job(
        self,
        job: Job,
    ):
    
        self.repo.delete(job)