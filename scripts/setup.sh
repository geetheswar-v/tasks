#!/bin/bash

# Setup script for Task Management System
echo "Starting setup..."

# Backend setup
echo "Setting up backend..."
cd backend
if command -v uv &> /dev/null
then
    echo "uv found, installing dependencies..."
    uv sync
else
    echo "uv not found. Please install uv (https://github.com/astral-sh/uv) to manage backend dependencies."
    exit 1
fi
cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend
if command -v bun &> /dev/null
then
    echo "bun found, installing dependencies..."
    bun install
    echo "Building frontend..."
    bun run build
elif command -v npm &> /dev/null
then
    echo "npm found, installing dependencies..."
    npm install
    echo "Building frontend..."
    npm run build
else
    echo "Neither bun nor npm found. Please install one of them to manage frontend dependencies."
    exit 1
fi
cd ..

echo "Setup complete! Run ./run.sh to start the application."
