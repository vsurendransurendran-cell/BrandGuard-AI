
from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class BrandGuideline(Base):
    __tablename__ = "brand_guidelines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    rule = Column(Text, nullable=False)
    approved = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContentSubmission(Base):
    __tablename__ = "content_submissions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(50), default="pending")
    compliance_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    issues = relationship(
        "ComplianceIssue",
        back_populates="submission",
        cascade="all, delete-orphan"
    )


class ComplianceIssue(Base):
    __tablename__ = "compliance_issues"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(
        Integer,
        ForeignKey("content_submissions.id"),
        nullable=False
    )
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), default="medium")
    suggested_fix = Column(Text, nullable=True)

    submission = relationship(
        "ContentSubmission",
        back_populates="issues"
    )


class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(
        Integer,
        ForeignKey("content_submissions.id"),
        nullable=False
    )
    decision = Column(String(50), nullable=False)
    reviewer_name = Column(String(150), nullable=True)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
