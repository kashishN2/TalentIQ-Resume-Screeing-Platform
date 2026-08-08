from app.schemas.ai_analysis import (
    AIAnalysisResponse,
    AIRecommendation,
)


def test_valid_ai_response():

    result = AIAnalysisResponse(

        ai_score=91,

        summary=(
            "Strong backend candidate "
            "with relevant experience."
        ),

        strengths=[
            "Python",
            "FastAPI",
        ],

        weaknesses=[
            "Limited AWS experience",
        ],

        matched_skills=[
            "Python",
            "FastAPI",
        ],

        missing_skills=[
            "AWS",
        ],

        recommendation=AIRecommendation.SHORTLIST,

        confidence=92,
    )

    assert result.ai_score == 91

    assert (
        result.recommendation
        == AIRecommendation.SHORTLIST
    )