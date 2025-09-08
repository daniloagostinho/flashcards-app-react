#!/bin/bash

# Script para iniciar o projeto Flashcards App
# Inicia tanto o backend (Python/FastAPI) quanto o frontend (React)

echo "🚀 Iniciando Flashcards App..."
echo "================================"

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando servidores..."
    pkill -f "python3 main.py" 2>/dev/null
    pkill -f "npm start" 2>/dev/null
    echo "✅ Servidores parados."
    exit 0
}

# Capturar Ctrl+C para limpar processos
trap cleanup SIGINT

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto (onde estão package.json e pasta backend)"
    exit 1
fi

# Verificar se o backend tem as dependências
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Virtual environment do backend não encontrado."
    echo "📦 Criando virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install --break-system-packages -r requirements.txt
    cd ..
fi

# Verificar se o frontend tem as dependências
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependências do frontend não encontradas."
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Inicializar banco de dados se necessário
if [ ! -f "backend/flashcards.db" ]; then
    echo "🗄️  Inicializando banco de dados..."
    cd backend
    source venv/bin/activate
    python3 init_db.py
    cd ..
fi

echo ""
echo "🔧 Iniciando Backend (Python/FastAPI)..."
cd backend
source venv/bin/activate
python3 main.py &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend inicializar
sleep 3

echo "🎨 Iniciando Frontend (React)..."
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados com sucesso!"
echo "================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para parar ambos os servidores"
echo ""

# Aguardar indefinidamente (até Ctrl+C)
wait

