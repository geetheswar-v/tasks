import random
from datetime import datetime, timedelta
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import Item, ItemStatus, UserCreate
from app import crud
from faker import Faker

fake = Faker()

def seed_user_data(username: str, name: str, password: str, num_items: int):
    with Session(engine) as session:
        db_user = crud.get_user_by_username(session, username)
        if not db_user:
            print(f"Creating user: {name} ({username})...")
            user_in = UserCreate(username=username, name=name, password=password)
            db_user = crud.create_user(session, user_in)
        else:
            print(f"User {username} already exists.")

        existing_items_count = session.query(Item).filter(Item.owner_id == db_user.id).count()
        
        print(f"Seeding {num_items} items for {username}...")
        statuses = list(ItemStatus)
        
        base_time = datetime.now() - timedelta(days=30)
        
        for i in range(1, num_items + 1):
            current_task_time = base_time + timedelta(seconds=i * 10)
            item = Item(
                title=f"OELP Task {existing_items_count + i}",
                description=fake.sentence(nb_words=12),
                status=random.choice(statuses),
                owner_id=db_user.id,
                created_at=current_task_time,
                updated_at=current_task_time
            )
            session.add(item)
        
        session.commit()
    print(f"Successfully added {num_items} items for {username}!")

def main():
    print("Starting database seeding...")
    create_db_and_tables()
    
    # SATCARD
    seed_user_data(
        username="satcard", 
        name="SATCARD", 
        password="satcard", 
        num_items=70
    )
    
    # Testing
    seed_user_data(
        username="testing", 
        name="Testing", 
        password="testing", 
        num_items=30
    )
    
    print("Database seeding complete!")

if __name__ == "__main__":
    main()
