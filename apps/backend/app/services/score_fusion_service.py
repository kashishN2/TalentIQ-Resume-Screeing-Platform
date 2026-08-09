from app.constants.scoring import (
    ATS_WEIGHT,
    AI_WEIGHT,
    SHORTLIST_THRESHOLD,
    REVIEW_THRESHOLD,
)


def calculate_overall_score(
    ats_score: float,
    ai_score: float,
) -> float:

    score = (
        ats_score * ATS_WEIGHT
        + ai_score * AI_WEIGHT
    )

    return round(score, 2)


def get_recommendation(
    overall_score: float,
) -> str:

    if overall_score >= SHORTLIST_THRESHOLD:
        return "SHORTLIST"

    if overall_score >= REVIEW_THRESHOLD:
        return "REVIEW"

    return "REJECT"