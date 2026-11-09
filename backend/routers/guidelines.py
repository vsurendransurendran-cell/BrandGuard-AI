
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import BrandGuideline
from schemas import GuidelineCreate, GuidelineResponse

router = APIRouter(
    prefix="/api/guidelines",
    tags=["Brand Guidelines"]
)


@router.post("/", response_model=GuidelineResponse)
def create_guideline(
    guideline: GuidelineCreate,
    db: Session = Depends(get_db)
):
    new_guideline = BrandGuideline(**guideline.model_dump())

    db.add(new_guideline)
    db.commit()
    db.refresh(new_guideline)

    return new_guideline


@router.get("/", response_model=list[GuidelineResponse])
def get_guidelines(db: Session = Depends(get_db)):
    return db.query(BrandGuideline).order_by(
        BrandGuideline.id.desc()
    ).all()


@router.get("/{guideline_id}", response_model=GuidelineResponse)
def get_guideline(guideline_id: int, db: Session = Depends(get_db)):
    guideline = db.query(BrandGuideline).filter(
        BrandGuideline.id == guideline_id
    ).first()

    if not guideline:
        raise HTTPException(status_code=404, detail="Guideline not found")

    return guideline


@router.put("/{guideline_id}", response_model=GuidelineResponse)
def update_guideline(
    guideline_id: int,
    guideline_data: GuidelineCreate,
    db: Session = Depends(get_db)
):
    guideline = db.query(BrandGuideline).filter(
        BrandGuideline.id == guideline_id
    ).first()

    if not guideline:
        raise HTTPException(
            status_code=404,
            detail="Guideline not found"
        )

    for key, value in guideline_data.model_dump().items():
        setattr(guideline, key, value)

    db.commit()
    db.refresh(guideline)

    return guideline



@router.delete("/{guideline_id}")
def delete_guideline(guideline_id: int, db: Session = Depends(get_db)):
    guideline = db.query(BrandGuideline).filter(
        BrandGuideline.id == guideline_id
    ).first()

    if not guideline:
        raise HTTPException(status_code=404, detail="Guideline not found")

    db.delete(guideline)
    db.commit()

    return {"message": "Guideline deleted successfully"}
