from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from app.db import get_session
from app.models import User, UserCreate, UserPublic
from app import crud
from app.api import deps

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserPublic)
def register(user_create: UserCreate, session: Session = Depends(get_session)):
    db_user = crud.get_user_by_username(session, user_create.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    return crud.create_user(session, user_create)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = crud.get_user_by_username(session, form_data.username)
    if not user or not deps.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = deps.create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "name": user.name
        }
    }

@router.get("/me", response_model=UserPublic)
def read_users_me(current_user: User = Depends(deps.get_current_user)):
    return current_user
