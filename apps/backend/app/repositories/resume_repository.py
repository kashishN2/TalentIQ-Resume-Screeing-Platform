import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.resume import Resume, UploadStatus

class ResumeRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        resume: Resume,
    ) -> Resume:
    
        self.db.add(resume)
    
        self.db.commit()
    
        self.db.refresh(resume)
    
        return resume
    
    def bulk_create(
        self,
        resumes: list[Resume],
    ):
    
        self.db.add_all(resumes)
    
        self.db.commit()
    
        return resumes

    def get_by_id(
        self,
        resume_id: uuid.UUID,
    ):
    
        stmt = (
            select(Resume)
            .where(
                Resume.id == resume_id
            )
        )
    
        return self.db.scalar(stmt)

    def get_by_job(
        self,
        job_id: uuid.UUID,
        skip: int = 0,
        limit: int = 20,
    ):
    
        stmt = (
            select(Resume)
            .where(
                Resume.job_id == job_id
            )
            .offset(skip)
            .limit(limit)
            .order_by(
                Resume.created_at.desc()
            )
        )
    
        return self.db.scalars(stmt).all()

    def count_by_job(
        self,
        job_id: uuid.UUID,
    ):
    
        stmt = (
            select(
                func.count(Resume.id)
            )
            .where(
                Resume.job_id == job_id
            )
        )
    
        return self.db.scalar(stmt)
    def update(
        self,
        resume: Resume,
    ):
    
        self.db.commit()
    
        self.db.refresh(resume)
    
        return resume

    def delete(
        self,
        resume: Resume,
    ):
    
        self.db.delete(resume)
    
        self.db.commit()

    def get_by_status(
        self,
        status: UploadStatus,
    ):
    
        stmt = (
            select(Resume)
            .where(
                Resume.upload_status == status
            )
        )
    
        return self.db.scalars(stmt).all()