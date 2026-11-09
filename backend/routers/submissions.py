from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.compliance import save_compliance_results
from database import get_db
from models import ContentSubmission
from schemas import ContentCreate, ContentResponse

router = APIRouter(
    prefix="/api/submissions",
    tags=["Content Submissions"]
)


@router.post("/", response_model=ContentResponse)
def create_submission(
    submission: ContentCreate,
    db: Session = Depends(get_db)
):
    new_submission = ContentSubmission(
        title=submission.title,
        content=submission.content
    )

    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)

    return save_compliance_results(new_submission, db)


@router.get("/", response_model=list[ContentResponse])
def get_submissions(db: Session = Depends(get_db)):
    return (
        db.query(ContentSubmission)
        .order_by(ContentSubmission.id.desc())
        .all()
    )


@router.get("/{submission_id}", response_model=ContentResponse)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db)
):
    submission = db.query(ContentSubmission).filter(
        ContentSubmission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found"
        )

    return submission