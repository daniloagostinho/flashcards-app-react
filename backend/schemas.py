from pydantic import BaseModel, EmailStr
from typing import List

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class FlashcardBase(BaseModel):
    word: str

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(BaseModel):
    id: int
    word: str
    translation: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CategoryRequest(BaseModel):
    categorias: List[str]
