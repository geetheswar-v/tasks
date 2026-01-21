@echo off
echo Starting setup...

:: Backend Setup
echo Setting up backend...
where uv >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo uv found, installing dependencies...
    cd backend
    call uv sync
    cd ..
) else (
    echo uv not found. Please install uv (https://github.com/astral-sh/uv) to manage backend dependencies.
    exit /b 1
)

:: Frontend Setup
echo Setting up frontend...
where bun >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo bun found, installing dependencies...
    cd frontend
    call bun install
    echo Building frontend...
    call bun run build
    cd ..
) else (
    where npm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo npm found, installing dependencies...
        cd frontend
        call npm install
        echo Building frontend...
        call npm run build
        cd ..
    ) else (
        echo Neither bun nor npm found. Please install one of them to manage frontend dependencies.
        exit /b 1
    )
)

echo Setup complete! Run scripts\run.bat to start the application.
