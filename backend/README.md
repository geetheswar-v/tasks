# Task Management Backend (OELP Assignment)

FastAPI backend for the Task Management System built as a part of OELP Assignment.

## Features

- **FastAPI**: Modern, high-performance web framework.
- **SQLite**: Local database storage.
- **SQLModel**: Integration of SQLAlchemy and Pydantic for models.
- **Soft Deletion**: Items are archived before permanent removal.
- **Bulk Operations**: Support for multi-delete and permanent delete.

## Setup & Run

We recommend using the scripts provided in the root `scripts/` folder for a unified experience across macOS, Linux, and Windows.

### 1. Install dependencies

```bash
uv sync
```

### 2. Run the server

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /items/`: List all items (filters: `status`, `include_deleted`).
- `POST /items/`: Create a new item.
- `GET /items/{id}`: Get item details.
- `PATCH /items/{id}`: Update an item.
- `DELETE /items/{id}`: Soft delete (archive) an item.
- `PATCH /items/{id}/restore`: Restore an archived item.
- `DELETE /items/{id}/permanent`: Permanently delete an item.
- `DELETE /items/`: Bulk soft delete items.
- `DELETE /items/bulk/permanent`: Bulk permanent delete items.

Documentation is available at [/docs](http://localhost:8000/docs) when the server is running.
