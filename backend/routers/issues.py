from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import ComplianceIssue

router = APIRouter(
    prefix="/api/issues",
    tags=["Compliance Issues"]
)


@router.get("/")
def get_all_issues(db: Session = Depends(get_db)):
    return (
        db.query(ComplianceIssue)
        .order_by(ComplianceIssue.id.desc())
        .all()
    )


@router.get("/submission/{submission_id}")
def get_submission_issues(
    submission_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ComplianceIssue)
        .filter(
            ComplianceIssue.submission_id == submission_id
        )
        .all()
    )