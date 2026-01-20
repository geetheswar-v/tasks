from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints import router
from app.db import create_db_and_tables

app = FastAPI(title="Task Management System")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual frontend URL
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
