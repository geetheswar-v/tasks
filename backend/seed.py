import random
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import Item, ItemStatus
from faker import Faker

fake = Faker()

def seed_data(num_items: int = 500):
    print(f"Seeding {num_items} items into the database...")
    create_db_and_tables()
    
    with Session(engine) as session:
        # Get count of existing items to avoid confusion if running multiple times
        existing_count = session.query(Item).count()
        
        statuses = list(ItemStatus)
        
        for i in range(1, num_items + 1):
            item = Item(
                title=f"OELP Task {existing_count + i}",
                description=fake.sentence(nb_words=12),
                status=random.choice(statuses)
            )
            session.add(item)
        
        session.commit()
    print(f"Successfully added {num_items} items!")

if __name__ == "__main__":
    seed_data()
