from database import engine
from models import User, Flashcard
from sqlalchemy import inspect

# Criar todas as tabelas
User.metadata.create_all(bind=engine)
Flashcard.metadata.create_all(bind=engine)
print("Banco de dados inicializado com sucesso!")

# Verificar se as tabelas foram criadas
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tabelas criadas: {tables}")
