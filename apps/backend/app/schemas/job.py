from datetime import datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)

from app.models.job import JobStatus


class JobBase(BaseModel):

    title: str = Field(
        min_length=3,
        max_length=150,
    )

    department: str = Field(
        min_length=2,
        max_length=100,
    )

    location: str = Field(
        min_length=2,
        max_length=100,
    )

    employment_type: str = Field(
        min_length=2,
        max_length=50,
    )

    experience_min: int = Field(
        ge=0,
        le=50,
    )

    experience_max: int = Field(
        ge=0,
        le=50,
    )

    description: str = Field(
        min_length=30,
    )

    required_skills: list[str] = Field(
        min_length=1,
    )

    minimum_score: int = Field(
        ge=0,
        le=100,
    )

    @model_validator(mode="after")
    def validate_experience(self):

        if self.experience_min > self.experience_max:
            raise ValueError(
                "experience_min cannot be greater than experience_max"
            )

        return self
class JobCreate(JobBase):
    pass
from typing import Optional
class JobUpdate(BaseModel):

    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    description: Optional[str] = None
    required_skills: Optional[list[str]] = None
    minimum_score: Optional[int] = None
    status: Optional[JobStatus] = None

class JobResponse(JobBase):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    status: JobStatus

    created_by: UUID

    created_at: datetime

    updated_at: datetime
class JobListResponse(BaseModel):

    jobs: list[JobResponse]

    total: int