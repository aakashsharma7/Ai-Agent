import requests
import json

BASE_URL = "http://localhost:8000"

# Sample data
sample_job_description = """
Senior Software Engineer
We are looking for a Senior Software Engineer with strong Python experience.
Requirements:
- 5+ years of Python development
- Experience with FastAPI or similar frameworks
- Strong understanding of REST APIs
- Experience with MongoDB
"""

sample_resume = """
John Doe
Senior Software Engineer

Experience:
- 6 years of Python development
- Led development of multiple REST APIs
- Experience with FastAPI and Django
- Worked with MongoDB and PostgreSQL
"""

def test_analyze_job():
    print("\nTesting /analyze-job endpoint...")
    response = requests.post(
        f"{BASE_URL}/analyze-job",
        json={"text": sample_job_description}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

def test_match_resume():
    print("\nTesting /match-resume endpoint...")
    response = requests.post(
        f"{BASE_URL}/match-resume",
        json={
            "text": sample_resume,
            "job_description": sample_job_description
        }
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

def test_optimize():
    print("\nTesting /optimize endpoint...")
    response = requests.post(
        f"{BASE_URL}/optimize",
        json={
            "text": sample_resume,
            "job_description": sample_job_description
        }
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

def test_generate_cover_letter():
    print("\nTesting /generate-cover-letter endpoint...")
    response = requests.post(
        f"{BASE_URL}/generate-cover-letter",
        json={
            "text": sample_resume,
            "job_description": sample_job_description
        }
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("Testing Job Application Optimizer API Routes")
    print("===========================================")
    
    try:
        test_analyze_job()
        test_match_resume()
        test_optimize()
        test_generate_cover_letter()
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"\nError: {str(e)}") 