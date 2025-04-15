from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from modules.job_analyzer import JobAnalyzer
from modules.resume_matcher import ResumeMatcher
from modules.optimizer import Optimizer
from modules.cover_letter import CoverLetterGenerator

# Load environment variables
load_dotenv()

app = FastAPI(title="Job Application Optimizer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
job_analyzer = JobAnalyzer()
resume_matcher = ResumeMatcher()
optimizer = Optimizer()
cover_letter_generator = CoverLetterGenerator()

class JobDescription(BaseModel):
    text: str

class ResumeData(BaseModel):
    text: str
    job_description: str

@app.post("/analyze-job")
async def analyze_job(job_description: JobDescription):
    try:
        analysis = await job_analyzer.analyze(job_description.text)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-resume")
async def match_resume(resume_data: ResumeData):
    try:
        match_result = await resume_matcher.match(resume_data.text, resume_data.job_description)
        return {"match_result": match_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize")
async def optimize_application(resume_data: ResumeData):
    try:
        suggestions = await optimizer.get_suggestions(resume_data.text, resume_data.job_description)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-cover-letter")
async def generate_cover_letter(resume_data: ResumeData):
    try:
        cover_letter = await cover_letter_generator.generate(resume_data.text, resume_data.job_description)
        return {"cover_letter": cover_letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 