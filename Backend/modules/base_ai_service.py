import google.generativeai as genai
import json
import re
from typing import Any, Dict, Optional
from ..config import settings

class BaseAIService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self._cache: Dict[str, Any] = {}

    async def _generate_response(self, prompt: str, cache_key: Optional[str] = None) -> str:
        """
        Generate a response from the AI model with optional caching.
        """
        if cache_key and cache_key in self._cache:
            return self._cache[cache_key]

        try:
            response = self.model.generate_content(prompt)
            result = response.text

            if cache_key:
                self._cache[cache_key] = result

            return result
        except Exception as e:
            raise Exception(f"Error generating AI response: {str(e)}")

    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse and clean JSON response from the AI model.
        """
        try:
            # Remove markdown code block if present
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
            
            # Remove comments from JSON
            response_text = re.sub(r'//.*?\n', '\n', response_text)  # Remove single-line comments
            response_text = re.sub(r'/\*.*?\*/', '', response_text, flags=re.DOTALL)  # Remove multi-line comments
            
            # Parse the JSON response
            return json.loads(response_text)
            
        except json.JSONDecodeError as e:
            return {
                "error": f"Failed to parse JSON response: {str(e)}",
                "raw_response": response_text
            }
        except Exception as e:
            return {
                "error": f"Unexpected error while parsing response: {str(e)}",
                "raw_response": response_text
            }

    def clear_cache(self):
        """
        Clear the response cache.
        """
        self._cache.clear() 