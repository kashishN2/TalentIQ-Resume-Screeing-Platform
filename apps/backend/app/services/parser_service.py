from app.constants.skills import TECH_SKILLS
from app.utils.regex_patterns import *

import re

def extract_email(text):

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

    text_lower = text.lower()

    found = []

    for skill in TECH_SKILLS:

        if skill.lower() in text_lower:

            found.append(skill)

    return sorted(list(set(found)))

def extract_name(text):

    for line in text.split("\n"):

        line = line.strip()

        if len(line) > 3:

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