import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class Optimizer:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    async def get_suggestions(self, resume_text: str, job_description: str) -> dict:
        """
        Generate optimization suggestions for the resume based on the job description.
        """
        prompt = f"""
        Analyze the following resume and job description to provide detailed optimization suggestions:

        JOB DESCRIPTION:
        {job_description}

        RESUME:
        {resume_text}

        Please provide the following optimization suggestions in a structured format:
        1. Content Improvements:
           - Suggested additions
           - Suggested removals
           - Content reorganization
        2. Keyword Optimization:
           - Missing keywords to add
           - Suggested keyword placement
        3. Format Improvements:
           - Layout suggestions
           - Section organization
        4. Achievement Highlights:
           - Suggested metrics to add
           - Impact statements to enhance
        5. Skills Presentation:
           - Skills to emphasize
           - Skills to add
           - Skills to remove or de-emphasize
        6. Action Items:
           - Specific changes to implement
           - Priority order of changes

        Format the response as a JSON object with these categories.
        """

        try:
            response = await self.model.generate_content(prompt)
            suggestions = self._parse_response(response.text)
            return suggestions
        except Exception as e:
            raise Exception(f"Error generating optimization suggestions: {str(e)}")

    def _parse_response(self, response_text: str) -> dict:
        """
        Parse the Gemini API response into a structured format.
        """
        try:
            import json
            return json.loads(response_text)
        except:
            return {
                "raw_suggestions": response_text,
                "error": "Could not parse response into structured format"
            } 