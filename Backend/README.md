# Job Application Optimizer AI Agent

An AI-powered tool that helps optimize job applications by analyzing job descriptions, matching resumes, providing optimization suggestions, and generating tailored cover letters.

## Features

- Job Description Analysis
- Resume Matching
- Optimization Suggestions
- Tailored Cover Letter Generator

## Tech Stack

- Backend AI Engine: Google's Gemini API
- Text Parsing: Python with pdfplumber, python-docx
- Data Storage: MongoDB (optional)
- API Framework: FastAPI

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

## Project Structure

```
.
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── modules/
    ├── job_analyzer.py     # Job description analysis
    ├── resume_matcher.py   # Resume matching logic
    ├── optimizer.py        # Optimization suggestions
    └── cover_letter.py     # Cover letter generation
```

## API Endpoints

- POST /analyze-job - Analyze job description
- POST /match-resume - Match resume with job description
- POST /optimize - Get optimization suggestions
- POST /generate-cover-letter - Generate tailored cover letter 