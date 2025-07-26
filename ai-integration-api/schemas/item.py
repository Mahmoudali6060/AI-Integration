from pydantic import BaseModel, Field

class ItemBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=5, max_length=300)

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int

    class Config:
        orm_mode = True

class ItemResponse(BaseModel):
    message: str
    data: ItemRead
