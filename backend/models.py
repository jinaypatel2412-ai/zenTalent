from sqlalchemy import Column, Integer, String
from database import Base

# --- User Model ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="candidate")

# --- Job Model ---
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    requirements = Column(String)
    is_active = Column(Integer, default=1)

# --- Resume Model ---
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    file_name = Column(String)
    file_path = Column(String)
    parsed_skills = Column(String, nullable=True)


# --- Application Model ---
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    job_id = Column(Integer, index=True)
    resume_id = Column(Integer, nullable=True)  # Optional: Link to resume
    status = Column(String, default="applied") # applied, viewed, shortlisted, rejected 