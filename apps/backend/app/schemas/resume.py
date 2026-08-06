from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.resume import UploadStatus
class ResumeResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    job_id: UUID

    candidate_name: str

    email: str | None

    phone: str | None

    original_filename: str

    stored_filename: str

    file_path: str

    upload_status: UploadStatus

    created_at: datetime

class ResumeListResponse(BaseModel):

    resumes: list[ResumeResponse]

    total: int

class UploadSummaryResponse(BaseModel):

    job_id: UUID

    uploaded: int

    failed: int

    message: str

class ResumeUploadResponse(BaseModel):

    resume: ResumeResponse

    message: str

