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
    direction: str = "en_to_pt"  # en_to_pt ou pt_to_en

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(BaseModel):
    id: int
    word: str
    translation: str
    direction: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CategoryRequest(BaseModel):
    categorias: List[str]
