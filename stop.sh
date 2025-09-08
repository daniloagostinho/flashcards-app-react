#!/bin/bash

# Script para parar o projeto Flashcards App
# Para tanto o backend quanto o frontend

echo "🛑 Parando Flashcards App..."
echo "============================="

# Parar processos do backend
echo "🔧 Parando Backend..."
pkill -f "python3 main.py" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend parado com sucesso"
else
    echo "⚠️  Backend não estava rodando"
fi

# Parar processos do frontend
echo "🎨 Parando Frontend..."
pkill -f "npm start" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend parado com sucesso"
else
    echo "⚠️  Frontend não estava rodando"
fi

# Parar processos do Node.js (caso ainda estejam rodando)
pkill -f "node.*react-scripts" 2>/dev/null

echo ""
echo "✅ Todos os servidores foram parados!"
echo "============================="

