from enum import Enum

from pydantic import BaseModel, Field


class AIRecommendation(str, Enum):
    SHORTLIST = "SHORTLIST"
    REVIEW = "REVIEW"
    REJECT = "REJECT"

class SkillEvidence(BaseModel):

    skill: str

    evidence: str
class AIAnalysisResponse(BaseModel):

    ai_score: float = Field(
        ge=0,
        le=100,
        description="AI suitability score from 0 to 100",
    )

    summary: str = Field(
        min_length=1,
        max_length=2000,
    )

    strengths: list[str] = Field(
        default_factory=list,
    )

    weaknesses: list[str] = Field(
        default_factory=list,
    )

    matched_skills: list[str] = Field(
        default_factory=list,
    )

    missing_skills: list[str] = Field(
        default_factory=list,
    )

    recommendation: AIRecommendation

    confidence: float = Field(
        ge=0,
        le=100,
    )
    evidence: list[SkillEvidence] = Field(
        default_factory=list,
    )

