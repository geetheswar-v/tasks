from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "large_large_large_scret_key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()