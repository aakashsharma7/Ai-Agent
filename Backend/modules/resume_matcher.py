import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class ResumeMatcher:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def match(self, resume_text: str, job_description: str) -> dict:
        """
        Match a resume against a job description and provide a detailed analysis.
        """
        prompt = f"""
        Compare the following resume with the job description and provide a detailed matching analysis:

        JOB DESCRIPTION:
        {job_description}

        RESUME:
        {resume_text}

        Please provide the following analysis in a structured format:
        1. Overall match percentage (0-100)
        2. Matching skills (list)
        3. Missing skills (list)
        4. Experience match analysis
        5. Education match analysis
        6. Specific recommendations for improvement
        7. Key strengths highlighted in the resume
        8. Areas that need enhancement

        Format the response as a JSON object with these categories.
        """

        try:
            response = await self.model.generate_content(prompt)
            match_result = self._parse_response(response.text)
            return match_result
        except Exception as e:
            raise Exception(f"Error matching resume: {str(e)}")

    def _parse_response(self, response_text: str) -> dict:
        """
        Parse the Gemini API response into a structured format.
        """
        try:
            import json
            return json.loads(response_text)
        except:
            return {
                "raw_analysis": response_text,
                "error": "Could not parse response into structured format"
            } 