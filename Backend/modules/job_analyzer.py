import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class JobAnalyzer:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-pro')

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
            response = self.model.generate_content(prompt)
            # Parse the response and structure it
            analysis = self._parse_response(response.text)
            return analysis
        except Exception as e:
            raise Exception(f"Error analyzing job description: {str(e)}")

    def _parse_response(self, response_text: str) -> dict:
        """
        Parse the Gemini API response into a structured format.
        """
        try:
            # Remove markdown code block if present
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
            
            # Remove comments from JSON (not valid JSON syntax)
            import re
            response_text = re.sub(r'//.*?\n', '\n', response_text)  # Remove single-line comments
            response_text = re.sub(r'/\*.*?\*/', '', response_text, flags=re.DOTALL)  # Remove multi-line comments
            
            # Parse the JSON response
            import json
            parsed_response = json.loads(response_text)
            
            # Return the parsed response directly
            return parsed_response
            
        except json.JSONDecodeError as e:
            # If JSON parsing fails, return a structured error response
            return {
                "error": f"Failed to parse JSON response: {str(e)}",
                "raw_response": response_text
            }
        except Exception as e:
            # Handle any other unexpected errors
            return {
                "error": f"Unexpected error while parsing response: {str(e)}",
                "raw_response": response_text
            } 