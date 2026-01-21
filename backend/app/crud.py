from typing import List, Optional
from sqlmodel import Session, select, func
from app.models import Item, ItemCreate, ItemUpdate, ItemStatus, User, UserCreate
from app.api.deps import get_password_hash

# User CRUD
def get_user_by_username(session: Session, username: str) -> Optional[User]:
    return session.exec(select(User).where(User.username == username)).first()

def create_user(session: Session, user_create: UserCreate) -> User:
    db_user = User(
        username=user_create.username,
        name=user_create.name,
        hashed_password=get_password_hash(user_create.password)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Item CRUD
def create_item(session: Session, item_create: ItemCreate, owner_id: int) -> Item:
    db_item = Item.model_validate(item_create, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def get_items(
    session: Session, 
    owner_id: int,
    offset: int = 0, 
    limit: int = 20, 
    status: Optional[ItemStatus] = None,
    include_deleted: bool = False
) -> List[Item]:
    statement = select(Item).where(Item.owner_id == owner_id)
    if not include_deleted:
        statement = statement.where(Item.is_deleted == False)
    else:
        statement = statement.where(Item.is_deleted == True)
    
    if status:
        statement = statement.where(Item.status == status)
    
    statement = statement.offset(offset).limit(limit).order_by(Item.created_at.desc())
    return session.exec(statement).all()

def get_item(session: Session, item_id: int, owner_id: int) -> Optional[Item]:
    return session.exec(
        select(Item).where(Item.id == item_id).where(Item.owner_id == owner_id)
    ).first()

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

def soft_delete_items(session: Session, item_ids: List[int], owner_id: int):
    statement = select(Item).where(Item.id.in_(item_ids)).where(Item.owner_id == owner_id)
    items = session.exec(statement).all()
    for item in items:
        item.is_deleted = True
        session.add(item)
    session.commit()
    return items

def permanent_delete_items(session: Session, item_ids: List[int], owner_id: int):
    statement = select(Item).where(Item.id.in_(item_ids)).where(Item.owner_id == owner_id)
    items = session.exec(statement).all()
    for item in items:
        session.delete(item)
    session.commit()
