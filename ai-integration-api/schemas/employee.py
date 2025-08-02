from pydantic import BaseModel

class EmployeeBase(BaseModel):
    name: str
    position: str
    email: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True
