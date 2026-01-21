from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlmodel import Session
from app.db import get_session
from app.models import Item, ItemCreate, ItemUpdate, ItemStatus, User
from app import crud
from app.api import deps

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=Item)
def create_item(
    item: ItemCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    return crud.create_item(session, item, current_user.id)

@router.get("/", response_model=List[Item])
def read_items(
    offset: int = 0,
    limit: int = Query(default=20, le=100),
    status: Optional[ItemStatus] = None,
    include_deleted: bool = False,
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    return crud.get_items(session, current_user.id, offset, limit, status, include_deleted)

@router.get("/{item_id}", response_model=Item)
def read_item(
    item_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    db_item = crud.get_item(session, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.patch("/{item_id}", response_model=Item)
def update_item(
    item_id: int, 
    item: ItemUpdate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    db_item = crud.get_item(session, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.update_item(session, db_item, item)

@router.delete("/bulk/permanent")
def permanent_delete_items(
    item_ids: List[int] = Body(...), 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    crud.permanent_delete_items(session, item_ids, current_user.id)
    return {"ok": True}

@router.delete("/", response_model=List[Item])
def soft_delete_items(
    item_ids: List[int] = Body(...), 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    return crud.soft_delete_items(session, item_ids, current_user.id)

@router.delete("/{item_id}", response_model=Item)
def soft_delete_item(
    item_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    db_item = crud.get_item(session, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.soft_delete_item(session, db_item)

@router.patch("/{item_id}/restore", response_model=Item)
def restore_item(
    item_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    db_item = crud.get_item(session, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.restore_item(session, db_item)

@router.delete("/{item_id}/permanent")
def permanent_delete_item(
    item_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user)
):
    db_item = crud.get_item(session, item_id, current_user.id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    crud.permanent_delete_item(session, db_item)
    return {"ok": True}
