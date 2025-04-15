import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class CoverLetterGenerator:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate(self, resume_text: str, job_description: str) -> dict:
        """
        Generate a tailored cover letter based on the resume and job description.
        """
        # Create the prompt without nested f-strings
        prompt = (
            "Generate a professional and tailored cover letter based on the following resume and job description:\n\n"
            "JOB DESCRIPTION:\n"
            f"{job_description}\n\n"
            "RESUME:\n"
            f"{resume_text}\n\n"
            "Please generate a cover letter that:\n"
            "1. Is personalized and specific to the job\n"
            "2. Highlights relevant experience and skills\n"
            "3. Demonstrates understanding of the role\n"
            "4. Shows enthusiasm and cultural fit\n"
            "5. Is concise and well-structured\n"
            "6. Uses professional language\n"
            "7. Includes a strong opening and closing\n\n"
            "Format the response as a JSON object with the following structure:\n"
            "{\n"
            '    "cover_letter": {\n'
            '        "full_text": "The complete cover letter",\n'
            '        "sections": {\n'
            '            "opening": "Opening paragraph",\n'
            '            "body": "Main content paragraphs",\n'
            '            "closing": "Closing paragraph"\n'
            "        },\n"
            '        "key_highlights": [\n'
            '            "List of key points emphasized in the letter"\n'
            "        ]\n"
            "    }\n"
            "}"
        )

        try:
            response = await self.model.generate_content(prompt)
            cover_letter = self._parse_response(response.text)
            return cover_letter
        except Exception as e:
            raise Exception(f"Error generating cover letter: {str(e)}")

    def _parse_response(self, response_text: str) -> dict:
        """
        Parse the Gemini API response into a structured format.
        """
        try:
            import json
            return json.loads(response_text)
        except:
            return {
                "raw_cover_letter": response_text,
                "error": "Could not parse response into structured format"
            } 