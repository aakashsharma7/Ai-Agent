from typing import Dict, Any
from .base_ai_service import BaseAIService

class JobAnalyzer(BaseAIService):
    async def analyze(self, job_description: str) -> Dict[str, Any]:
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
        Each category should be a list of items except for Experience Level which should be a single string.
        """

        try:
            # Generate cache key based on job description
            cache_key = f"job_analysis_{hash(job_description)}"
            
            # Get response from AI model
            response_text = await self._generate_response(prompt, cache_key)
            
            # Parse and return the structured response
            return self._parse_json_response(response_text)
            
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