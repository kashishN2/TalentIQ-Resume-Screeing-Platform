from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    DEFAULT_ADMIN_NAME: str

    DEFAULT_ADMIN_EMAIL: str

    DEFAULT_ADMIN_PASSWORD: str

    # Gemini configuration
    GEMINI_API_KEY: str

    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    # Email configuration
    EMAIL_MODE: str = "smtp"
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM: str
    
@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
