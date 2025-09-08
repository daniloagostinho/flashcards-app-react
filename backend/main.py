from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
import requests
import random
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

# Função de tradução para flashcards de vocabulário
async def get_translation(word: str, direction: str = "en_to_pt") -> str:
    """
    Sistema de tradução automática para flashcards de vocabulário.
    Traduz palavras entre inglês e português usando um serviço confiável.
    
    Args:
        word: Palavra a ser traduzida
        direction: "en_to_pt" para inglês→português ou "pt_to_en" para português→inglês
    """
    
    # Dicionários de traduções comuns para melhor performance
    en_to_pt = {
        'study': 'estudar',
        'enjoy': 'apreciar, gostar',
        'love': 'amar',
        'work': 'trabalhar',
        'play': 'brincar, jogar',
        'sleep': 'dormir',
        'eat': 'comer',
        'drink': 'beber',
        'think': 'pensar',
        'feel': 'sentir',
        'learn': 'aprender',
        'teach': 'ensinar',
        'help': 'ajudar',
        'care': 'cuidar',
        'hope': 'esperar',
        'dream': 'sonhar',
        'travel': 'viajar',
        'home': 'casa',
        'friend': 'amigo',
        'family': 'família',
        'happy': 'feliz',
        'sad': 'triste',
        'angry': 'bravo',
        'excited': 'animado',
        'worried': 'preocupado',
        'proud': 'orgulhoso',
        'surprised': 'surpreso',
        'run': 'correr',
        'jump': 'pular',
        'swim': 'nadar',
        'dance': 'dançar',
        'sing': 'cantar',
        'paint': 'pintar',
        'cook': 'cozinhar',
        'dog': 'cachorro',
        'cat': 'gato',
        'car': 'carro',
        'house': 'casa',
        'tree': 'árvore',
        'water': 'água',
        'fire': 'fogo',
        'sun': 'sol',
        'moon': 'lua',
        'star': 'estrela',
        'book': 'livro',
        'music': 'música',
        'sport': 'esporte',
        'food': 'comida',
        'money': 'dinheiro',
        'time': 'tempo',
        'school': 'escola',
        'hospital': 'hospital',
        'park': 'parque',
        'beach': 'praia',
        'mountain': 'montanha',
        'city': 'cidade',
        'country': 'país',
        'hello': 'olá',
        'goodbye': 'tchau',
        'thank you': 'obrigado',
        'please': 'por favor',
        'yes': 'sim',
        'no': 'não',
        'big': 'grande',
        'small': 'pequeno',
        'good': 'bom',
        'bad': 'ruim',
        'new': 'novo',
        'old': 'velho',
        'hot': 'quente',
        'cold': 'frio',
        'fast': 'rápido',
        'slow': 'lento',
        'easy': 'fácil',
        'difficult': 'difícil',
        'beautiful': 'bonito',
        'ugly': 'feio',
        'rich': 'rico',
        'poor': 'pobre',
        'young': 'jovem',
        'strong': 'forte',
        'weak': 'fraco',
        'tall': 'alto',
        'short': 'baixo',
        'fat': 'gordo',
        'thin': 'magro',
        'clean': 'limpo',
        'dirty': 'sujo',
        'full': 'cheio',
        'empty': 'vazio',
        'open': 'aberto',
        'closed': 'fechado',
        'right': 'direita',
        'left': 'esquerda',
        'up': 'cima',
        'down': 'baixo',
        'front': 'frente',
        'back': 'trás',
        'inside': 'dentro',
        'outside': 'fora',
        'here': 'aqui',
        'there': 'ali',
        'today': 'hoje',
        'yesterday': 'ontem',
        'tomorrow': 'amanhã',
        'morning': 'manhã',
        'afternoon': 'tarde',
        'evening': 'noite',
        'night': 'noite',
        'week': 'semana',
        'month': 'mês',
        'year': 'ano',
        'day': 'dia',
        'hour': 'hora',
        'minute': 'minuto',
        'second': 'segundo',
        'monday': 'segunda-feira',
        'tuesday': 'terça-feira',
        'wednesday': 'quarta-feira',
        'thursday': 'quinta-feira',
        'friday': 'sexta-feira',
        'saturday': 'sábado',
        'sunday': 'domingo',
        'january': 'janeiro',
        'february': 'fevereiro',
        'march': 'março',
        'april': 'abril',
        'may': 'maio',
        'june': 'junho',
        'july': 'julho',
        'august': 'agosto',
        'september': 'setembro',
        'october': 'outubro',
        'november': 'novembro',
        'december': 'dezembro'
    }
    
    # Dicionário reverso (português → inglês)
    pt_to_en = {v: k for k, v in en_to_pt.items()}
    
    # Buscar tradução no dicionário apropriado
    if direction == "en_to_pt":
        translation = en_to_pt.get(word.lower(), word)
        langpair = "en|pt"
    else:  # pt_to_en
        translation = pt_to_en.get(word.lower(), word)
        langpair = "pt|en"
    
    # Se não encontrou no dicionário, usar um serviço de tradução online
    if translation == word:
        try:
            # Usar MyMemory API (gratuita e confiável)
            url = f"https://api.mymemory.translated.net/get?q={word}&langpair={langpair}"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data['responseStatus'] == 200 and data['responseData']['translatedText']:
                    translation = data['responseData']['translatedText']
        except:
            # Se falhar, manter a palavra original
            translation = word
    
    return translation

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
    # Ordenar por data de criação (mais recentes primeiro)
    flashcards = db.query(Flashcard).order_by(Flashcard.created_at.desc()).all()
    return [
        FlashcardResponse(
            id=card.id,
            word=card.word,
            translation=card.translation,
            direction=card.direction
        ) for card in flashcards
    ]

@app.post("/flashcards", response_model=FlashcardResponse)
async def create_flashcard(flashcard: FlashcardCreate, db: Session = Depends(get_db)):
    # Gerar tradução para a palavra
    translation = await get_translation(flashcard.word, flashcard.direction)
    
    db_flashcard = Flashcard(
        word=flashcard.word,
        translation=translation,
        direction=flashcard.direction
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return FlashcardResponse(
        id=db_flashcard.id,
        word=db_flashcard.word,
        translation=db_flashcard.translation,
        direction=db_flashcard.direction
    )

@app.delete("/flashcards/{flashcard_id}")
async def delete_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    """Deletar um flashcard específico"""
    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado")
    
    db.delete(flashcard)
    db.commit()
    
    return {"message": "Flashcard deletado com sucesso"}

@app.get("/translation/{word}")
async def get_translation_endpoint(word: str, direction: str = "en_to_pt"):
    """
    Endpoint para buscar tradução de uma palavra específica
    """
    try:
        translation = await get_translation(word, direction)
        return {"word": word, "translation": translation, "direction": direction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar tradução: {str(e)}")

@app.post("/flashcards-gerados", response_model=list[FlashcardResponse])
async def generate_flashcards(categories: CategoryRequest, db: Session = Depends(get_db)):
    """
    Gera flashcards inteligentes usando o sistema de busca de imagens avançado
    """
    generated_flashcards = []
    
    for category in categories.categorias:
        # Palavras expandidas para cada categoria (incluindo conceitos abstratos)
        sample_words = {
            "animals": ["cat", "dog", "bird", "fish", "lion", "elephant", "butterfly"],
            "colors": ["red", "blue", "green", "yellow", "purple", "orange", "pink"],
            "food": ["apple", "banana", "bread", "milk", "cheese", "pizza", "cake"],
            "family": ["mother", "father", "sister", "brother", "grandmother", "baby", "cousin"],
            "school": ["book", "pen", "pencil", "teacher", "student", "classroom", "homework"],
            "emotions": ["happy", "sad", "angry", "excited", "worried", "proud", "surprised"],
            "actions": ["run", "jump", "swim", "dance", "sing", "paint", "cook"],
            "abstract": ["love", "hope", "dream", "freedom", "peace", "wisdom", "courage"],
            "activities": ["study", "work", "play", "sleep", "eat", "travel", "exercise"],
            "nature": ["tree", "flower", "mountain", "ocean", "sun", "moon", "star"]
        }
        
        words = sample_words.get(category.lower(), [category + "1", category + "2", category + "3"])
        
        for word in words[:3]:  # Limitar a 3 flashcards por categoria
            # Usar o sistema de tradução (sempre inglês → português para geração automática)
            translation = await get_translation(word, "en_to_pt")
            
            db_flashcard = Flashcard(
                word=word,
                translation=translation,
                direction="en_to_pt"
            )
            db.add(db_flashcard)
            generated_flashcards.append(db_flashcard)
    
    db.commit()
    
    # Refresh para obter os IDs dos flashcards criados
    for flashcard in generated_flashcards:
        db.refresh(flashcard)
    
    return [
        FlashcardResponse(
            id=card.id,
            word=card.word,
            translation=card.translation,
            direction=card.direction
        ) for card in generated_flashcards
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
