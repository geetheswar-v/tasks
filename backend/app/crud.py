from typing import List, Optional
from sqlmodel import Session, select, func
from app.models import Item, ItemCreate, ItemUpdate, ItemStatus

def create_item(session: Session, item_create: ItemCreate) -> Item:
    db_item = Item.model_validate(item_create)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def get_items(
    session: Session, 
    offset: int = 0, 
    limit: int = 20, 
    status: Optional[ItemStatus] = None,
    include_deleted: bool = False
) -> List[Item]:
    statement = select(Item)
    if not include_deleted:
        statement = statement.where(Item.is_deleted == False)
    else:
        statement = statement.where(Item.is_deleted == True)
    
    if status:
        statement = statement.where(Item.status == status)
    
    statement = statement.offset(offset).limit(limit).order_by(Item.created_at.desc())
    return session.exec(statement).all()

def get_item(session: Session, item_id: int) -> Optional[Item]:
    return session.get(Item, item_id)

def update_item(session: Session, db_item: Item, item_update: ItemUpdate) -> Item:
    item_data = item_update.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def soft_delete_item(session: Session, db_item: Item) -> Item:
    db_item.is_deleted = True
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def restore_item(session: Session, db_item: Item) -> Item:
    db_item.is_deleted = False
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def permanent_delete_item(session: Session, db_item: Item):
    session.delete(db_item)
    session.commit()

def soft_delete_items(session: Session, item_ids: List[int]):
    statement = select(Item).where(Item.id.in_(item_ids))
    items = session.exec(statement).all()
    for item in items:
        item.is_deleted = True
        session.add(item)
    session.commit()
    return items

def permanent_delete_items(session: Session, item_ids: List[int]):
    statement = select(Item).where(Item.id.in_(item_ids))
    items = session.exec(statement).all()
    for item in items:
        session.delete(item)
    session.commit()
