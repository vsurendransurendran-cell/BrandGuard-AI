from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ContentSubmission, ReviewDecision
from schemas import ReviewCreate, ReviewResponse

router = APIRouter(
    prefix="/api/reviews",
    tags=["Human Reviews"]
)


@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    submission = db.query(ContentSubmission).filter(
        ContentSubmission.id == review.submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )

    decision = review.decision.lower()

    if decision not in ["approved", "rejected", "changes_requested"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid review decision"
        )

    new_review = ReviewDecision(
        submission_id=review.submission_id,
        decision=decision,
        reviewer_name=review.reviewer_name,
        comments=review.comments
    )

    submission.status = decision

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review


@router.get("/")
def get_reviews(db: Session = Depends(get_db)):
    return (
        db.query(ReviewDecision)
        .order_by(ReviewDecision.id.desc())
        .all()
    )