from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    DEBUG: bool = False
    APP_DOMAIN: str = "example.com"
    APP_DATA_PATH: str = "/tmp"
    APP_DATABASE_DSN: str = "sqlite:////tmp/database.db"
    OPENROUTER_API_KEY: str


settings = Settings()
