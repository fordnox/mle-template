# MLE Template

A FastAPI-based backend template for ML engineering projects.

## Tech Stack

- **Framework**: FastAPI
- **Python**: 3.12+
- **Package Manager**: uv
- **Database**: PostgreSQL (SQLAlchemy + psycopg2)
- **Validation**: Pydantic
- **Task Queue**: arq
- **HTTP Client**: httpx
- **Payments**: Stripe

## Development Tools

- pytest - Testing
- mypy - Type checking
- ruff - Linting
- black - Code formatting
- isort - Import sorting
- pre-commit - Git hooks

## Getting Started

```bash
cd backend
uv sync
uv run fastapi dev app/main.py
```

## Docker

```bash
cd backend
docker build -t mle-template .
docker run -p 80:80 mle-template
```

## API Endpoints

- `GET /` - Root endpoint (status check)
- `GET /health` - Health check endpoint
