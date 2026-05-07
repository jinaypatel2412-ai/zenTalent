import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
import google.generativeai as genai # Gemini API

import database
import models
import schemas
from fastapi.middleware.cors import CORSMiddleware

# Gemini AI Setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Database setup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app = FastAPI()

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development mate badha domains allow karya che
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE badhu allow karse
    allow_headers=["*"],
)
os.makedirs("uploaded_resumes", exist_ok=True)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# PDF mathi text read karva nu function
def extract_text_from_pdf(pdf_path: str):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return ""

# Gemini AI pase thi skills extract karavva nu function
def get_skills_with_ai(resume_text: str):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Extract only the top 5 to 7 technical skills from this resume text. Return them as a comma-separated list without any extra words or formatting. Resume text: {resume_text}"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("AI Error:", e)
        return "Skill extraction failed"

# --- APIs ---

@app.get("/")
def read_root():
    return {"message": "Welcome to Zentalent AI Recruitment API!"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"message": "Supabase connection successful!"}
    except Exception as e:
        return {"error": "Connection failed."}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(name=user.name, email=user.email, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/jobs/", response_model=schemas.JobResponse)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    new_job = models.Job(title=job.title, description=job.description, requirements=job.requirements, is_active=1)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

from typing import List

# API: Badhi Jobs jova mate
@app.get("/jobs/", response_model=List[schemas.JobResponse])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(models.Job).filter(models.Job.is_active == 1).offset(skip).limit(limit).all()
    return jobs

# AI Resume Upload API
@app.post("/upload-resume/")
async def upload_resume(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Fakt PDF file j allow che.")
    
    file_location = f"uploaded_resumes/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # PDF mathi text kadho
    extracted_text = extract_text_from_pdf(file_location)
    
    # Gemini AI ne text aapi ne skills kadho
    ai_extracted_skills = get_skills_with_ai(extracted_text)
        
    new_resume = models.Resume(
        user_id=user_id, 
        file_name=file.filename, 
        file_path=file_location,
        parsed_skills=ai_extracted_skills # AI na data ahya save thase
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    return {
        "message": "AI e resume parse kari lidho che", 
        "file_name": file.filename,
        "ai_skills": ai_extracted_skills,
        "resume_id": new_resume.id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


