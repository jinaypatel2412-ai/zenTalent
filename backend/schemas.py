from pydantic import BaseModel

# --- User Schemas ---
class UserCreate(BaseModel):
    name: str
    email: str
    role: str = "candidate"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobCreate(BaseModel):
    title: str
    description: str
    requirements: str

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: str
    is_active: int

    class Config:
        from_attributes = True


