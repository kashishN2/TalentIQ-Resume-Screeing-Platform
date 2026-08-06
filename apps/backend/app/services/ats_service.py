from app.constants.scoring import *

from rapidfuzz import fuzz

def match_skills(
    jd_skills,
    resume_skills,
):

    matched = []

    missing = []

    resume_lower = {
        s.lower(): s
        for s in resume_skills
    }

    for skill in jd_skills:

        found = False

        for resume_skill in resume_lower:

            similarity = fuzz.ratio(
                skill.lower(),
                resume_skill,
            )

            if similarity >= 90:

                matched.append(skill)

                found = True

                break

        if not found:

            missing.append(skill)

    return matched, missing

def skill_score(
    matched,
    required,
):

    if len(required) == 0:

        return 100

    return (
        len(matched)
        /
        len(required)
    ) * 100

def experience_score(
    required,
    actual,
):

    if actual >= required:

        return 100

    return (
        actual
        /
        required
    ) * 100

def final_score(

    skill,

    experience,

    education,

    projects,

    certification,

):

    return (

        skill * 0.40 +

        experience * 0.20 +

        education * 0.15 +

        projects * 0.15 +

        certification * 0.10

    )

def recommendation(
    score,
):

    if score >= 90:

        return "SHORTLIST"

    if score >= 75:

        return "REVIEW"

    return "REJECT"