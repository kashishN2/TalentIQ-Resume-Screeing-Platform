from enum import Enum

from pydantic import BaseModel, EmailStr


class CandidateDecision(str, Enum):
    SHORTLIST = "SHORTLIST"
    REJECT = "REJECT"


class CandidateDecisionRequest(BaseModel):
    decision: CandidateDecision


class EmailResponse(BaseModel):
    success: bool
    recipient: EmailStr
    decision: CandidateDecision
    message: str