# backend/app/routers/storage.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from app.models import StorageUnit, Deceased
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/storage", tags=["Storage"])

@router.get("/", response_model=list[schemas.StorageUnitResponse])
def list_storage(db: Session = Depends(get_db)):
    units = db.query(models.StorageUnit).order_by(models.StorageUnit.unit_number).all()
    return units

@router.post("/", response_model=schemas.StorageUnitResponse)
def create_storage(payload: schemas.StorageUnitCreate, db: Session = Depends(get_db)):
    existing = db.query(models.StorageUnit).filter(models.StorageUnit.unit_number == payload.unit_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Unit number already exists")
    unit = models.StorageUnit(**payload.model_dump())
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit

@router.post("/{unit_id}/assign", response_model=schemas.StorageUnitResponse)
def assign_unit(unit_id: int, deceased_id: int, deadline: Optional[datetime] = None, db: Session = Depends(get_db)):
    unit = db.query(models.StorageUnit).get(unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Storage unit not found")
    if unit.status == "occupied":
        raise HTTPException(status_code=400, detail="Unit already occupied")

    deceased = db.query(models.Deceased).get(deceased_id)
    if not deceased:
        raise HTTPException(status_code=404, detail="Deceased record not found")

    # update unit occupant fields
    unit.status = "occupied"
    unit.occupant_id = deceased.id
    unit.occupant_name = deceased.full_name
    unit.date_admitted = datetime.utcnow()
    unit.storage_deadline = deadline
    db.add(unit)

    # optionally update deceased record to link to storage
    deceased.storage_unit_id = unit.id
    deceased.status = "processing"
    db.add(deceased)

    db.commit()
    db.refresh(unit)
    return unit

def assign_body(unit_id: int, record_id: int, deadline: str, db: Session = Depends(get_db)):
    unit = db.query(StorageUnit).filter(StorageUnit.id == unit_id).first()
    deceased = db.query(Deceased).filter(Deceased.id == record_id).first()

    if not unit or not deceased:
        raise HTTPException(status_code=404, detail="Unit or deceased not found")

    unit.occupant_id = deceased.id
    unit.occupant_name = deceased.full_name
    unit.storage_deadline = deadline
    unit.status = "occupied"

    db.commit()
    return {"message": "Body assigned successfully"}

@router.patch("/{unit_id}/release", response_model=schemas.StorageUnitResponse)
def release_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(models.StorageUnit).get(unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Storage unit not found")
    unit.status = "available"
    unit.occupant_id = None
    unit.occupant_name = None
    unit.date_admitted = None
    unit.storage_deadline = None
    db.add(unit)

    # optionally update deceased status if linked
    if unit.occupant_id:
        deceased = db.query(models.Deceased).get(unit.occupant_id)
        if deceased:
            deceased.storage_unit_id = None
            deceased.status = "released"
            db.add(deceased)

    db.commit()
    db.refresh(unit)
    return unit

@router.patch("/{unit_id}/maintenance", response_model=schemas.StorageUnitResponse)
def set_maintenance(unit_id: int, maintenance: bool = True, db: Session = Depends(get_db)):
    unit = db.query(models.StorageUnit).get(unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Storage unit not found")
    unit.status = "maintenance" if maintenance else "available"
    unit.last_maintenance = datetime.utcnow() if maintenance else unit.last_maintenance
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit
