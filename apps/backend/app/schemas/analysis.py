from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SkillEvidenceResponse(BaseModel):
    skill: str
    evidence: str


class CandidateAnalysisResponse(BaseModel):
    rank: int

    resume_id: UUID
    candidate_name: str
    email: str | None

    ats_score: float
    ai_score: float
    overall_score: float

    recommendation: str
    confidence: float

    matched_skills: list[str]
    missing_skills: list[str]

    strengths: list[str]
    weaknesses: list[str]

    recruiter_summary: str

    evidence: list[SkillEvidenceResponse]

    analyzed_at: datetime


class JobAnalysisResponse(BaseModel):
    job_id: UUID

    total_analyzed: int

    candidates: list[CandidateAnalysisResponse]