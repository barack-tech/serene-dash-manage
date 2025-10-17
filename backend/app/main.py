from fastapi import FastAPI
from app.database import Base, engine
from app.routers import deceased, storage
from fastapi.middleware.cors import CORSMiddleware

# Create tables in MySQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mortuary Management System API")

# Allow frontend (port 8080) to access backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(deceased.router)

@app.get("/")
def root():
    return {"message": "Mortuary Management API running"}

app.include_router(storage.router)
