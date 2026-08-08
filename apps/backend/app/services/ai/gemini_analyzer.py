from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.ai_analysis import AIAnalysisResponse
from app.services.ai.base import AIAnalyzer


class GeminiAnalyzer(AIAnalyzer):

    def __init__(self):

        if not settings.GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = settings.GEMINI_MODEL

    def analyze(
        self,
        resume_text: str,
        job_description: str,
    ) -> AIAnalysisResponse:

        prompt = f"""
You are a professional recruitment
resume analysis assistant.

Analyze the candidate resume against
the provided job description.

JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME:
{resume_text}

Evaluate only information that is
actually present in the resume.

Do not invent:
- skills
- experience
- education
- certifications
- projects
- employment history

Identify:

1. Overall candidate suitability
2. Relevant strengths
3. Relevant weaknesses
4. Skills present in both resume and JD
5. Important skills from JD missing from resume
6. A concise recruiter-friendly summary

Do not use protected or personal characteristics
when evaluating the candidate.

Return the result according to the
provided structured response schema.
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AIAnalysisResponse,
            ),
        )

        if response.parsed is None:
            raise ValueError(
                "Gemini returned an invalid structured response."
            )

        return response.parsed