
from pydantic import BaseModel, ConfigDict
from typing import Optional


# BRAND GUIDELINES

class GuidelineCreate(BaseModel):
    name: str
    category: str
    rule: str
    approved: bool = True


class GuidelineResponse(GuidelineCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# CONTENT SUBMISSIONS

class ContentCreate(BaseModel):
    title: str
    content: str


class ContentResponse(BaseModel):
    id: int
    title: str
    content: str
    status: str
    compliance_score: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# HUMAN REVIEW

class ReviewCreate(BaseModel):
    submission_id: int
    decision: str
    reviewer_name: Optional[str] = None
    comments: Optional[str] = None


class ReviewResponse(ReviewCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
