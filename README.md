# Template

Opinionated web project template for building projects with AI.

## Tech Stack

- **Framework**: FastAPI
- **Python**: 3.12+
- **Package Manager**: uv
- **Database**: PostgreSQL (SQLAlchemy + psycopg2)
- **Validation**: Pydantic
- **DB Migrations**: alembic
- **Task Queue**: arq
- **HTTP Client**: httpx

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure the following:

| Variable | Description |
|----------|-------------|
| `APP_DOMAIN` | Application domain (e.g., `example.com`) |
| `APP_DATA_PATH` | File system path for application data storage |
| `APP_DATABASE_DSN` | Database connection string (SQLAlchemy format) |
| `OPENROUTER_API_KEY` | API key for OpenRouter AI model routing service |
