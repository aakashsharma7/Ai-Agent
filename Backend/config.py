import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Job Application Optimizer API"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # AI Model Settings
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # Cache Settings
    CACHE_TTL: int = 3600  # 1 hour
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 