from sqlmodel import Session, create_engine, SQLModel
from typing import Generator
from app.config import settings

engine = create_engine(
    f"sqlite+libsql://{settings.database_url}?secure=true",
    connect_args={"auth_token": settings.database_token},
    echo=False
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
