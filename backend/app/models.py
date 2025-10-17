from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from .database import Base


class Deceased(Base):
    __tablename__ = "deceased"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150))
    date_of_birth = Column(DateTime, nullable=True)
    date_of_death = Column(DateTime, nullable=False)
    gender = Column(String(10))
    identification = Column(String(50))
    cause_of_death = Column(String(255))
    next_of_kin = Column(String(100))
    contact_number = Column(String(30))
    address = Column(String(255))
    religion = Column(String(50))
    admission_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="pending")
    notes = Column(Text, nullable=True)




class StorageUnit(Base):
    __tablename__ = "storage_units"

    id = Column(Integer, primary_key=True, index=True)
    unit_number = Column(String(50), nullable=False, unique=True)   # e.g., A-01
    wing = Column(String(50), nullable=True)
    floor = Column(Integer, nullable=True)
    status = Column(Enum('available','occupied','maintenance', name="storage_status"), nullable=False, default='available')
    temperature = Column(Float, nullable=True)
    capacity = Column(Enum('single','double', name="storage_capacity"), nullable=True, default='single')

    occupant_id = Column(Integer, nullable=True)        # optional FK to deceased.id
    occupant_name = Column(String(150), nullable=True)
    date_admitted = Column(DateTime, nullable=True)
    storage_deadline = Column(DateTime, nullable=True)

    last_maintenance = Column(DateTime, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
