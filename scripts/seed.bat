@echo off
echo Starting database seeding...

:: Backend seeding
pushd backend
where uv >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using uv to run seed script...
    uv run seed.py
) else (
    echo uv not found. Please install uv (https://github.com/astral-sh/uv^) to run the seed script.
    popd
    exit /b 1
)
popd

echo Database seeding complete!
