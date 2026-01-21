from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints import router
from app.db import create_db_and_tables
from scalar_fastapi import get_scalar_api_reference

app = FastAPI(
    title="Task Management System",
    docs_url=None,
    redoc_url=None
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Management API"}

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="API Docs"
    )
