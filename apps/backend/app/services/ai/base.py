from abc import ABC, abstractmethod

from app.schemas.ai_analysis import AIAnalysisResponse


class AIAnalyzer(ABC):

    @abstractmethod
    def analyze(
        self,
        resume_text: str,
        job_description: str,
    ) -> AIAnalysisResponse:
        """
        Analyze a resume against a job description.
        """
        raise NotImplementedError