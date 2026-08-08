from app.schemas.ai_analysis import (
    AIAnalysisResponse,
    AIRecommendation,
)

from app.services.ai.base import AIAnalyzer


class MockAIAnalyzer(AIAnalyzer):

    def analyze(
        self,
        resume_text: str,
        job_description: str,
    ) -> AIAnalysisResponse:

        return AIAnalysisResponse(

            ai_score=85,

            summary=(
                "Candidate demonstrates relevant "
                "technical experience for the role."
            ),

            strengths=[
                "Relevant technical skills",
                "Practical project experience",
            ],

            weaknesses=[
                "Some required skills may be missing",
            ],

            matched_skills=[
                "Python",
                "FastAPI",
            ],

            missing_skills=[
                "Kubernetes",
            ],

            recommendation=(
                AIRecommendation.REVIEW
            ),

            confidence=80,
        )