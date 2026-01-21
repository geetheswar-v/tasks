#!/bin/bash

# Run script for Task Management System (Preview Mode)
echo "🚀 Starting Task Management System..."

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting backend (FastAPI)..."
cd backend
# Note: In production we would use gunicorn/uvicorn without --reload
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 &
cd ..

# Start frontend preview
echo "Starting frontend preview..."
cd frontend
if command -v bun &> /dev/null
then
    bun run preview
else
    npm run preview
fi

# Wait for background processes
wait
