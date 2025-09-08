from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from database import SessionLocal, engine, Base
from models import User, Flashcard
from schemas import UserCreate, UserLogin, FlashcardCreate, FlashcardResponse, Token, CategoryRequest

# Carregar variáveis de ambiente
load_dotenv()

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Configurações
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configuração de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração de autenticação
security = HTTPBearer()

# Inicializar FastAPI
app = FastAPI(title="Flashcards API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend React
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Dependency para obter sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Funções de autenticação
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# Endpoints
@app.get("/")
async def root():
    return {"message": "Flashcards API is running!"}

@app.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar se usuário já existe
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Criar novo usuário
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Verificar usuário
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/flashcards", response_model=list[FlashcardResponse])
async def get_flashcards(db: Session = Depends(get_db)):
    flashcards = db.query(Flashcard).all()
    return flashcards

@app.post("/flashcards", response_model=FlashcardResponse)
async def create_flashcard(flashcard: FlashcardCreate, db: Session = Depends(get_db)):
    db_flashcard = Flashcard(
        word=flashcard.word,
        icon_url=flashcard.iconUrl
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@app.post("/flashcards-gerados", response_model=list[FlashcardResponse])
async def generate_flashcards(categories: CategoryRequest, db: Session = Depends(get_db)):
    # Simular geração de flashcards baseado nas categorias
    # Em uma implementação real, você usaria uma API de imagens como Unsplash
    generated_flashcards = []
    
    for category in categories.categorias:
        # Exemplo de flashcards gerados para cada categoria
        sample_words = {
            "animals": ["cat", "dog", "bird", "fish", "lion"],
            "colors": ["red", "blue", "green", "yellow", "purple"],
            "food": ["apple", "banana", "bread", "milk", "cheese"],
            "family": ["mother", "father", "sister", "brother", "grandmother"],
            "school": ["book", "pen", "pencil", "teacher", "student"]
        }
        
        words = sample_words.get(category.lower(), [category + "1", category + "2", category + "3"])
        
        for word in words[:3]:  # Limitar a 3 flashcards por categoria
            # URL de exemplo para ícones (em produção, use uma API real)
            icon_url = f"https://via.placeholder.com/150/4F46E5/FFFFFF?text={word.upper()}"
            
            db_flashcard = Flashcard(
                word=word,
                icon_url=icon_url
            )
            db.add(db_flashcard)
            generated_flashcards.append(db_flashcard)
    
    db.commit()
    
    # Refresh para obter os IDs dos flashcards criados
    for flashcard in generated_flashcards:
        db.refresh(flashcard)
    
    return generated_flashcards

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
