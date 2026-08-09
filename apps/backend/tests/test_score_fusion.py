from app.services.score_fusion_service import (
    calculate_overall_score,
    get_recommendation,
)


def test_overall_score():

    score = calculate_overall_score(
        ats_score=95,
        ai_score=85,
    )

    assert score == 92


def test_shortlist():

    recommendation = get_recommendation(92)

    assert recommendation == "SHORTLIST"


def test_review():

    recommendation = get_recommendation(80)

    assert recommendation == "REVIEW"


def test_reject():

    recommendation = get_recommendation(60)

    assert recommendation == "REJECT"