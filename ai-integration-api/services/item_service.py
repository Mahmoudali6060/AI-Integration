from sqlalchemy.orm import Session
from models.item import Item
from schemas.item import ItemCreate

def get_all_items(db: Session):
    return db.query(Item).all()

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def create_item(db: Session, item: ItemCreate):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item

def update_item(db: Session, item_id: int, item_data: ItemCreate):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item:
        item.title = item_data.title
        item.description = item_data.description
        db.commit()
        db.refresh(item)
    return item
