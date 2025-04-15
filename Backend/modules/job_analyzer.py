import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class JobAnalyzer:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')

    async def analyze(self, job_description: str) -> dict:
        """
        Analyze a job description and extract key information.
        """
        prompt = f"""
        Analyze the following job description and provide a structured analysis:
        
        {job_description}
        
        Please provide the following information in a structured format:
        1. Key responsibilities
        2. Required skills and qualifications
        3. Preferred skills and qualifications
        4. Industry and role type
        5. Experience level
        6. Key keywords for optimization
        
        Format the response as a JSON object with these categories.
        """

        try:
            response = await self.model.generate_content(prompt)
            # Parse the response and structure it
            analysis = self._parse_response(response.text)
            return analysis
        except Exception as e:
            raise Exception(f"Error analyzing job description: {str(e)}")

    def _parse_response(self, response_text: str) -> dict:
        """
        Parse the Gemini API response into a structured format.
        """
        # This is a simplified parser - you might want to enhance it based on actual response format
        try:
            # Assuming the response is in a format that can be evaluated as a Python dictionary
            import json
            return json.loads(response_text)
        except:
            # Fallback parsing if the response is not in JSON format
            return {
                "raw_analysis": response_text,
                "error": "Could not parse response into structured format"
            } 