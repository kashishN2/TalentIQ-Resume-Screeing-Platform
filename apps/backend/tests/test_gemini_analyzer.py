import pytest

from app.core.config import settings
from app.services.ai.gemini_analyzer import GeminiAnalyzer


@pytest.mark.skipif(
    not settings.GEMINI_API_KEY,
    reason="Gemini API key not configured",
)
def test_gemini_analyzer():

    analyzer = GeminiAnalyzer()

    result = analyzer.analyze(

        resume_text="""
        Rahul Sharma

        Software Engineer

        Skills:
        Python
        FastAPI
        PostgreSQL
        Docker

        Experience:
        2 years backend development

        Projects:
        Built REST APIs using FastAPI.
        """,

        job_description="""
        We are looking for a Backend Engineer.

        Required skills:
        Python
        FastAPI
        PostgreSQL
        Docker
        AWS

        Candidates should have backend
        development experience.
        """,
    )

    assert result is not None

    assert 0 <= result.ai_score <= 100

    assert len(result.summary) > 0