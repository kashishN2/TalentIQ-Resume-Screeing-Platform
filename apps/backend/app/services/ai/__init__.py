import os

from app.services.ai.base import AIAnalyzer
from app.services.ai.gemini_analyzer import GeminiAnalyzer
from app.services.ai.mock_analyzer import MockAIAnalyzer


def get_ai_analyzer() -> AIAnalyzer:

    provider = os.getenv(
        "AI_PROVIDER",
        "mock",
    ).lower()

    if provider == "gemini":
        return GeminiAnalyzer()

    return MockAIAnalyzer()