from pydantic import BaseModel, Field


class CandidateRankingResult(BaseModel):

    candidate_id: str

    ats_score: float = Field(
        ge=0,
        le=100,
    )

    ai_score: float = Field(
        ge=0,
        le=100,
    )

    overall_score: float = Field(
        ge=0,
        le=100,
    )

    recommendation: str

    rank: int | None = None