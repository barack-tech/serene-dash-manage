from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class DeceasedBase(BaseModel):
    full_name: str
    date_of_birth: Optional[datetime]
    date_of_death: datetime
    gender: Optional[str]
    identification: Optional[str]
    cause_of_death: Optional[str]
    next_of_kin: Optional[str]
    contact_number: Optional[str]
    address: Optional[str]
    religion: Optional[str]
    notes: Optional[str]

class DeceasedCreate(DeceasedBase):
    pass

class DeceasedResponse(DeceasedBase):
    id: int
    admission_date: Optional[datetime]
    status: str

    class Config:
        orm_mode = True




class StorageUnitBase(BaseModel):
    unit_number: str
    wing: Optional[str] = None
    floor: Optional[int] = None
    status: Optional[str] = "available"
    temperature: Optional[float] = None
    capacity: Optional[str] = "single"
    occupant_id: Optional[int] = None
    occupant_name: Optional[str] = None
    date_admitted: Optional[datetime] = None
    storage_deadline: Optional[datetime] = None
    last_maintenance: Optional[datetime] = None

class StorageUnitCreate(StorageUnitBase):
    unit_number: str

class StorageUnitResponse(StorageUnitBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = { "from_attributes": True }
