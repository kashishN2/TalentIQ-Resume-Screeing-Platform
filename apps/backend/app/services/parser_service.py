from app.constants.skills import TECH_SKILLS
from app.utils.regex_patterns import *

import re

def extract_email(text):
    # Handle Markdown email links:
    # [name@example.com](mailto:name@example.com)
    markdown_match = re.search(
        r"\[([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\]",
        text,
        re.IGNORECASE,
    )

    if markdown_match:
        return markdown_match.group(1)

    # Handle normal email addresses
    match = EMAIL_PATTERN.search(text)

    if match:
        return match.group()

    return None

def extract_phone(text):

    match = PHONE_PATTERN.search(text)

    if match:
        return match.group()

    return None

def extract_github(text):

    match = GITHUB_PATTERN.search(text)

    if match:
        return match.group()

    return None

def extract_linkedin(text):

    match = LINKEDIN_PATTERN.search(text)

    if match:
        return match.group()

    return None
def extract_skills(text):
    found = []
    for skill in TECH_SKILLS: 
        pattern = rf"(?<![A-Za-z0-9+#.]){re.escape(skill)}(?![A-Za-z0-9+#.])" 
        if re.search(pattern, text, re.IGNORECASE): found.append(skill) 
    return sorted(set(found))
    
def extract_name(text):
    # First, try to extract the name appearing before the email label.
    match = re.search(
        r"^\s*(.+?)\s+Email\s*:",
        text,
        re.IGNORECASE,
    )

    if match:
        name = match.group(1).strip()

        # Remove common Markdown formatting
        name = re.sub(r"[*_`]", "", name).strip()

        if 2 <= len(name) <= 100:
            return name

    # Fallback: use the first reasonable non-empty line
    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        # Skip obvious section/contact labels
        if re.search(
            r"^(email|phone|mobile|linkedin|github|skills|education|experience)\b",
            line,
            re.IGNORECASE,
        ):
            continue

        # Avoid returning a huge paragraph as a name
        if 2 <= len(line) <= 100 and len(line.split()) <= 8:
            return line

    return None

SECTION_HEADERS = [

    "education",

    "experience",

    "projects",

    "skills",

    "certifications",

    "achievements"

]

def parse_resume(text):

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "github": extract_github(text),

        "linkedin": extract_linkedin(text),

        "skills": extract_skills(text)

    }
