from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel, Column, DateTime, func, String

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    name: str

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: int

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class ItemStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class ItemBase(SQLModel):
    title: str = Field(min_length=5)
    description: Optional[str] = None
    status: ItemStatus = Field(default=ItemStatus.PENDING)

class ItemCreate(ItemBase):
    pass

class ItemUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=5)
    description: Optional[str] = None
    status: Optional[ItemStatus] = None
    is_deleted: Optional[bool] = None

class Item(ItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(),
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(),
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(), 
            onupdate=func.now()
        )
    )
    is_deleted: bool = Field(default=False)
