from app.services.ai.mock_analyzer import (
    MockAIAnalyzer,
)


def test_mock_analyzer():

    analyzer = MockAIAnalyzer()

    result = analyzer.analyze(

        resume_text=(
            "Python FastAPI PostgreSQL"
        ),

        job_description=(
            "Looking for a Python backend developer."
        ),
    )

    assert result.ai_score == 85

    assert result.confidence == 80

    assert len(result.strengths) > 0
from app.services.ai import get_ai_analyzer
def test_ai_factory():

    analyzer = get_ai_analyzer()

    assert analyzer is not None