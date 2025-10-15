#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    echo "Loading env variables from './.env.local'"
    set -o allexport
    source ./.env.local
    set +o allexport
else
    echo "Warning: .env.local file not found. Using default values."
fi

echo "Killing old Docker processes"
docker compose rm -fs

echo "Spinning up Docker containers"
docker compose build --force-rm --no-cache && \
docker compose up --detach && \
echo "" && \
echo "========================================" && \
echo "Heat Map Application is running!" && \
echo "Access at: http://localhost:${PORT:-8000}" && \
echo "========================================" && \
echo "" && \
docker compose logs --follow
