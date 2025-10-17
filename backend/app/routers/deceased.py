from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/deceased", tags=["Deceased"])

@router.post("/", response_model=schemas.DeceasedResponse)
def create_deceased(payload: schemas.DeceasedCreate, db: Session = Depends(get_db)):
    new_record = models.Deceased(**payload.dict())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.get("/", response_model=list[schemas.DeceasedResponse])
def list_deceased(db: Session = Depends(get_db)):
    return db.query(models.Deceased).order_by(models.Deceased.id.desc()).all()
def get_deceased(db: Session = Depends(get_db)):
    # Only fetch unassigned or pending deceased
    deceased_list = db.query(Deceased).all()
    return [
        {"id": str(d.id), "name": d.full_name, "dateAdmitted": d.admission_date.strftime("%Y-%m-%d")}
        for d in deceased_list
    ]

@router.get("/{record_id}", response_model=schemas.DeceasedResponse)
def get_deceased(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.Deceased).filter(models.Deceased.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@router.delete("/{record_id}")
def delete_deceased(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.Deceased).filter(models.Deceased.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": f"Record {record_id} deleted successfully"}
