@echo off
echo Starting Task Management System...

:: Start backend in a background process
echo Starting backend (FastAPI)...
:: Using start /b to run in the same window but in background
start /b cmd /c "cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000"

:: Start frontend in this process
echo Starting frontend preview...
cd frontend
where bun >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    call bun run preview
) else (
    call npm run preview
)
cd ..
