#!/bin/bash

# Seed script for Task Management System (with Auth)
echo "Starting database seeding..."

# Backend seeding
cd backend
if command -v uv &> /dev/null
then
    echo "Using uv to run seed script..."
    uv run seed.py
else
    echo "uv not found. Please install uv (https://github.com/astral-sh/uv) to run the seed script."
    exit 1
fi
cd ..

echo "Database seeding complete!"
