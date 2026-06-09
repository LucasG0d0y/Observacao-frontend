#!/bin/bash
# Script para iniciar o backend e frontend em desenvolvimento

echo "🚀 Iniciando Observação App..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para iniciar o backend
start_backend() {
    echo -e "${BLUE}📦 Iniciando Backend (Spring Boot)...${NC}"
    cd backend/server
    
    # Verificar se Java está instalado
    if ! command -v java &> /dev/null; then
        echo -e "${YELLOW}⚠️  Java não encontrado. Por favor, instale Java 17+${NC}"
        return 1
    fi
    
    # Executar Maven
    mvn spring-boot:run &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
    echo "   URL: http://localhost:8080"
    echo "   API: http://localhost:8080/api"
}

# Função para iniciar o frontend
start_frontend() {
    echo -e "${BLUE}⚛️  Iniciando Frontend (React + Vite)...${NC}"
    cd frontend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📥 Instalando dependências...${NC}"
        npm install
    fi
    
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
    echo "   URL: http://localhost:5173"
}

# Verificar se estamos no diretório raiz
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  Execute este script do diretório raiz do projeto${NC}"
    exit 1
fi

# Iniciar tanto backend quanto frontend
start_backend
sleep 2
start_frontend

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Aplicação iniciada com sucesso!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
echo "API:      http://localhost:8080/api"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Manter o script rodando
wait
