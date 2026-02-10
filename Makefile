# Set the user and group IDs in docker compose to the same as the host user so new files belong to the host user
# instead of root.
# This can be changed to your own user/group ID here, though these defaults should be fine for most people.
export MY_UID := 1000
export MY_GID := 1000

sync: ## npm install and uv sync
	cd backend && uv sync
	cd frontend && pnpm i

build: ## Build backend and frontend Docker images
	@echo "Building backend Docker image..."
	docker build -f backend/Dockerfile --tag backend:latest backend

lint: ## Run linters
	@cd backend && uv run python -c "from app import *" || (echo '🚨 import failed, this means you introduced unprotected imports! 🚨'; exit 1)
	@cd backend && uv run ruff check . --fix
	@cd backend && uv run black .
	@cd backend && uv run isort .

openapi:  ## Generate OpenAPI schema from FastAPI app
	cd backend && uv run python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > ./openapi.json
	cd frontend && pnpm run generate-client

test:
	cd backend && uv run pytest -v 2>&1

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# catch-all for any undefined targets - this prevents error messages
# when running things like make npm-install <package>
%:
	@:
