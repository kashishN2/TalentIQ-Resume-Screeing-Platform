from app.schemas.ranking import (
    CandidateRankingResult,
)

from app.services.score_fusion_service import (
    calculate_overall_score,
    get_recommendation,
)


def create_candidate_result(
    candidate_id: str,
    ats_score: float,
    ai_score: float,
) -> CandidateRankingResult:

    overall_score = calculate_overall_score(
        ats_score,
        ai_score,
    )

    recommendation = get_recommendation(
        overall_score
    )

    return CandidateRankingResult(

        candidate_id=candidate_id,

        ats_score=ats_score,

        ai_score=ai_score,

        overall_score=overall_score,

        recommendation=recommendation,
    )

def rank_candidates(
    candidates: list[CandidateRankingResult],
) -> list[CandidateRankingResult]:

    sorted_candidates = sorted(
        candidates,
        key=lambda candidate:
            candidate.overall_score,
        reverse=True,
    )

    for index, candidate in enumerate(
        sorted_candidates,
        start=1,
    ):

        candidate.rank = index

    return sorted_candidates