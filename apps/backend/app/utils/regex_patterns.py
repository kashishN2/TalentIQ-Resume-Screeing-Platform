import re

EMAIL_PATTERN = re.compile(
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
)

PHONE_PATTERN = re.compile(
    r"(?:\+91[\-\s]?)?[6-9]\d{9}"
)

LINKEDIN_PATTERN = re.compile(
    r"(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+",
    re.IGNORECASE,
)

GITHUB_PATTERN = re.compile(
    r"(https?:\/\/)?(www\.)?github\.com\/[^\s]+",
    re.IGNORECASE,
)