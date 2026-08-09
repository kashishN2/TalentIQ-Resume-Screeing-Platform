from enum import Enum

class Recommendation(str, Enum):
    SHORTLIST = "SHORTLIST"
    REVIEW = "REVIEW"
    REJECT = "REJECT"

import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    Float,
    ForeignKey,
    Text,
)

from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class ResumeAnalysis(Base):

    __tablename__ = "resume_analysis"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    resume_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "resumes.id",
            ondelete="CASCADE",
        ),
        unique=True,
    )

    ats_score: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    ai_score: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    overall_score: Mapped[float] = mapped_column(
        Float,
        default=0,
    )
    confidence: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    matched_skills: Mapped[list] = mapped_column(
        JSONB,
        default=list,
    )

    missing_skills: Mapped[list] = mapped_column(
        JSONB,
        default=list,
    )

    strengths: Mapped[list] = mapped_column(
        JSONB,
        default=list,
    )

    weaknesses: Mapped[list] = mapped_column(
        JSONB,
        default=list,
    )
    evidence: Mapped[list] = mapped_column(
        JSONB,
        default=list,
    )
    recruiter_summary: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    recommendation: Mapped[Recommendation] = mapped_column(
        SqlEnum(Recommendation),
        default=Recommendation.REVIEW,
    )

    analyzed_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    resume = relationship(
        "Resume",
        back_populates="analysis",
    )

