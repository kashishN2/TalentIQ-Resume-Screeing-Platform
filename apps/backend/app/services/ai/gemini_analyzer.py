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
You are an objective recruitment resume analysis engine.

Your task is to evaluate a candidate's resume against a
specific job description.

========================
JOB DESCRIPTION
========================

{job_description}

========================
CANDIDATE RESUME
========================

{resume_text}

========================
ANALYSIS RULES
========================

1. Evaluate ONLY information explicitly supported by the
   candidate's resume.

2. Never invent or assume:
   - skills
   - years of experience
   - job titles
   - companies
   - projects
   - certifications
   - education
   - technologies
   - responsibilities

3. Compare the candidate's demonstrated skills with the
   requirements in the job description.

4. Identify:
   - skills clearly demonstrated by the candidate
   - important skills required by the JD but not demonstrated
   - relevant experience
   - relevant projects
   - strengths supported by evidence
   - weaknesses or gaps supported by evidence

5. Treat equivalent technology names as related where
   technically appropriate.

   Examples:
   - REST API and REST APIs
   - PostgreSQL and PostgreSQL database
   - JavaScript and JS

6. Do NOT treat vaguely related technologies as exact matches.

7. Do not give credit merely because a technology is
   mentioned in an unrelated context.

8. Prioritize skills and experience that are directly
   relevant to the job description.

9. Do not use protected or sensitive personal characteristics
   when evaluating the candidate.

   Never use:
   - gender
   - religion
   - caste
   - race
   - age
   - marital status
   - disability
   - nationality
   - political affiliation
   - other sensitive personal characteristics

10. The AI score must represent job relevance, not the
    candidate's writing style or resume formatting.

11. Confidence represents how confident you are that the
    available resume evidence supports your analysis.

12. If information is missing from the resume, explicitly
    treat it as "not demonstrated" rather than assuming it.

========================
AI SCORE GUIDELINES
========================

Use the following general guidance:

90-100:
Excellent alignment with the role.
Most important requirements are clearly demonstrated.

75-89:
Good alignment with some meaningful gaps.

60-74:
Moderate alignment with several important gaps.

40-59:
Weak alignment with many missing requirements.

0-39:
Very limited evidence of suitability.

These ranges are guidelines, not rigid rules.

========================
RECOMMENDATION
========================

Use:

SHORTLIST
when the candidate demonstrates strong alignment.

REVIEW
when the candidate has reasonable alignment but
requires recruiter review.

REJECT
when there is very little evidence of alignment.

Do not make the recommendation based on any protected
or sensitive personal characteristic.

========================
OUTPUT
========================

Return ONLY the structured response matching the
provided AIAnalysisResponse schema.
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