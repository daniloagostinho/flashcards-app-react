# Flashcards Backend API

Backend em Python com FastAPI para a aplicação de flashcards React.

## 🚀 Configuração e Execução

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### 1. Instalação das Dependências

```bash
# Instalar dependências do projeto
pip install --break-system-packages -r requirements.txt

# Instalar validador de email (necessário para Pydantic)
pip install --break-system-packages email-validator
```

### 2. Inicialização do Banco de Dados

```bash
# Criar as tabelas no banco SQLite
python3 init_db.py
```

**Saída esperada:**
```
Banco de dados inicializado com sucesso!
Tabelas criadas: ['flashcards', 'users']
```

### 3. Executar o Servidor

```bash
# Iniciar o servidor de desenvolvimento
python3 main.py
```

**Saída esperada:**
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 4. Verificar se está funcionando

```bash
# Testar se a API está respondendo
curl http://localhost:8000/
```

**Resposta esperada:**
```json
{"message":"Flashcards API is running!"}
```

## 📚 Documentação da API

Acesse `http://localhost:8000/docs` para ver a documentação interativa da API (Swagger UI).

## 🔗 Endpoints Disponíveis

### Autenticação
- `POST /signup` - Cadastro de usuário
- `POST /login` - Login de usuário

### Flashcards
- `GET /flashcards` - Listar todos os flashcards
- `POST /flashcards` - Criar novo flashcard
- `POST /flashcards-gerados` - Gerar flashcards por categoria
- `GET /smart-image/{word}` - Buscar imagem inteligente para uma palavra

## 🗄️ Banco de Dados

O projeto usa SQLite como banco de dados local:
- **Arquivo:** `flashcards.db`
- **Tabelas:** `users`, `flashcards`
- **Localização:** `backend/flashcards.db`

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na pasta `backend/`:

```env
# Chave secreta para JWT (obrigatória)
SECRET_KEY=sua-chave-secreta-aqui

# Chave da API Unsplash (opcional - para imagens reais)
# Obtenha sua chave em: https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=sua-chave-unsplash-aqui
```

**Nota:** A chave do Unsplash é opcional. Sem ela, o sistema usará ícones SVG e fallbacks inteligentes.

## 🧠 Sistema Inteligente de Imagens

O backend implementa um sistema inteligente de busca de imagens que funciona em 3 níveis:

### 1. **Ícones SVG (Iconify API)**
- Melhor para objetos concretos: `cat`, `dog`, `car`, `house`
- Busca automática em milhares de ícones
- Formato SVG escalável e leve

### 2. **Imagens Reais (Unsplash API)**
- Melhor para conceitos abstratos: `study`, `enjoy`, `love`, `hope`
- Mapeamento inteligente de palavras para termos visuais
- Imagens de alta qualidade e relevância

### 3. **Fallback Inteligente**
- Emojis + texto estilizado para palavras não encontradas
- Cores aleatórias e design atrativo
- Garante que sempre haverá uma representação visual

### Exemplos de Funcionamento:
- `"study"` → Ícone de livros 📚 ou imagem de estudante
- `"love"` → Ícone de coração ❤️ ou imagem romântica  
- `"xyz123"` → Fallback com emoji 💡 e texto estilizado

### CORS
O backend está configurado para aceitar requisições de:
- `http://localhost:3000` (Frontend React)
- `http://127.0.0.1:3000` (Frontend React)

## 🧪 Testando a API

### Cadastro de Usuário
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com", "password": "senha123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@example.com", "password": "senha123"}'
```

### Listar Flashcards
```bash
curl http://localhost:8000/flashcards
```

## 🚨 Solução de Problemas

### Erro: "no such table: users"
```bash
# Execute o script de inicialização do banco
python3 init_db.py
```

### Erro: "email-validator is not installed"
```bash
pip install --break-system-packages email-validator
```

### Erro: "externally-managed-environment"
```bash
# Use a flag --break-system-packages
pip install --break-system-packages -r requirements.txt
```

## 📁 Estrutura do Projeto

```
backend/
├── main.py              # API principal com FastAPI
├── models.py            # Modelos do banco de dados (SQLAlchemy)
├── schemas.py           # Schemas de validação (Pydantic)
├── database.py          # Configuração do banco SQLite
├── init_db.py           # Script de inicialização do banco
├── requirements.txt     # Dependências Python
├── .env                 # Variáveis de ambiente (criar)
├── flashcards.db        # Banco de dados SQLite (criado automaticamente)
└── README.md           # Este arquivo
```

## 🔄 Integração com Frontend

O backend está configurado para trabalhar com o frontend React que roda em `http://localhost:3000`. O frontend já está configurado para fazer requisições para este backend.

## 📝 Logs

O servidor exibe logs detalhados no terminal, incluindo:
- Requisições recebidas
- Erros de validação
- Operações do banco de dados
- Status das respostas HTTP
