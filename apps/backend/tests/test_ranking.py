from app.services.ranking_service import (
    create_candidate_result,
    rank_candidates,
)


def test_candidate_ranking():

    candidates = [

        create_candidate_result(
            candidate_id="candidate_1",
            ats_score=90,
            ai_score=80,
        ),

        create_candidate_result(
            candidate_id="candidate_2",
            ats_score=98,
            ai_score=95,
        ),

        create_candidate_result(
            candidate_id="candidate_3",
            ats_score=70,
            ai_score=75,
        ),
    ]

    ranked = rank_candidates(candidates)

    assert ranked[0].candidate_id == "candidate_2"

    assert ranked[0].rank == 1

    assert ranked[1].rank == 2

    assert ranked[2].rank == 3