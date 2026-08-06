import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.job import Job, JobStatus
class JobRepository:

    def __init__(self, db: Session):
        self.db = db
    
    def create(self, job: Job) -> Job:
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job
    
    def get_by_id(
        self, 
        job_id: uuid.UUID,
    ) -> Job | None:

        stmt = select(Job).where(Job.id == job_id)

        return self.db.scalar(stmt)
    def get_all(
        self,
        skip: int = 0,
        limit: int = 10,
    ):

        stmt = (
           select(Job)
           .offset(skip)
           .limit(limit)
           .order_by(Job.created_at.desc())
        )

        return self.db.scalars(stmt).all()
    def get_by_status(
        self,
        status: JobStatus,
        skip: int = 0,
        limit: int = 10,
    ):

        stmt = (
            select(Job)
            .where(Job.status == status)
            .offset(skip)
            .limit(limit)
        )
    
        return self.db.scalars(stmt).all()
    def count(self) -> int:

        stmt = select(
          func.count(Job.id)
        )

        return self.db.scalar(stmt)
    def update(
        self,
        job: Job,
    ):

        self.db.commit()
    
        self.db.refresh(job)
    
        return job
    def delete(
        self,
        job: Job,
    ):

        self.db.delete(job)

        self.db.commit()
    def get_by_title(
        self,
        title: str,
    ):
    
        stmt = (
            select(Job)
            .where(Job.title == title)
        )
    
        return self.db.scalar(stmt)