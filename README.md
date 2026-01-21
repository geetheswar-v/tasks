# Task Management Assignment (OELP Assignment)

A Task Management System with a FastAPI backend and a React/Vite/Tailwind frontend built as a part of OELP Assignment.

## Quick Start

The easiest way to get the project running is using the provided scripts.

### 1. Prerequisites

Ensure you have the following installed:

- **[uv](https://github.com/astral-sh/uv)** (for Python backend)
- **[bun](https://bun.sh/)** or **npm** (for React frontend)

### 2. Setup

Run the setup script to install dependencies and build the frontend.

**macOS / Linux:**

```bash
./scripts/setup.sh
#or
sh scripts/setup.sh
```

**Windows:**

```batch
scripts\setup.bat
```

### 3. Run

Start the application (Backend + Frontend Preview).

**macOS / Linux:**

```bash
./scripts/run.sh
#or
sh scripts/run.sh
```

**Windows:**

```batch
scripts\run.bat
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: SQLite (managed via SQLModel)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **Validation**: Pydantic / SQLModel

### Frontend

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
