from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import time
import logging

from config import settings
from modules.job_analyzer import JobAnalyzer
from modules.resume_matcher import ResumeMatcher
from modules.optimizer import Optimizer
from modules.cover_letter import CoverLetterGenerator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
job_analyzer = JobAnalyzer()
resume_matcher = ResumeMatcher()
optimizer = Optimizer()
cover_letter_generator = CoverLetterGenerator()

# Request/Response Models
class JobDescription(BaseModel):
    text: str

class ResumeData(BaseModel):
    text: str
    job_description: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# Middleware for request timing and logging
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} completed in {process_time:.2f}s")
    return response

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "detail": str(e)}
        )

# Routes
@app.post("/analyze-job", response_model=dict, responses={500: {"model": ErrorResponse}})
async def analyze_job(job_description: JobDescription):
    try:
        analysis = await job_analyzer.analyze(job_description.text)
        return {"analysis": analysis}
    except Exception as e:
        logger.error(f"Error in analyze_job: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-resume", response_model=dict, responses={500: {"model": ErrorResponse}})
async def match_resume(resume_data: ResumeData):
    try:
        match_result = await resume_matcher.match(resume_data.text, resume_data.job_description)
        return {"match_result": match_result}
    except Exception as e:
        logger.error(f"Error in match_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize", response_model=dict, responses={500: {"model": ErrorResponse}})
async def optimize_application(resume_data: ResumeData):
    try:
        suggestions = await optimizer.get_suggestions(resume_data.text, resume_data.job_description)
        return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Error in optimize_application: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-cover-letter", response_model=dict, responses={500: {"model": ErrorResponse}})
async def generate_cover_letter(resume_data: ResumeData):
    try:
        cover_letter = await cover_letter_generator.generate(resume_data.text, resume_data.job_description)
        return {"cover_letter": cover_letter}
    except Exception as e:
        logger.error(f"Error in generate_cover_letter: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 