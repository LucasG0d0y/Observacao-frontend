@echo off
REM Script para iniciar o backend e frontend em desenvolvimento

echo.
echo ========================================
echo   Observacao - Frontend Backend Setup
echo ========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "backend" (
    echo Erro: Diretório 'backend' não encontrado
    echo Execute este script do diretório raiz do projeto
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Erro: Diretório 'frontend' não encontrado
    echo Execute este script do diretório raiz do projeto
    pause
    exit /b 1
)

echo.
echo [BACKEND] Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo Erro: Java não encontrado. Por favor, instale Java 17+
    pause
    exit /b 1
)

echo [BACKEND] Java encontrado!
echo.
echo [FRONTEND] Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo Erro: Node.js não encontrado. Por favor, instale Node.js 16+
    pause
    exit /b 1
)

echo [FRONTEND] Node.js encontrado!
echo.

REM Iniciar backend
echo.
echo ========== INICIANDO BACKEND ==========
echo.
start "Backend - Observacao" cmd /k "cd backend\server && mvn spring-boot:run"

REM Aguardar um pouco para o backend iniciar
timeout /t 5 /nobreak

REM Iniciar frontend
echo.
echo ========== INICIANDO FRONTEND ==========
echo.
cd frontend

REM Verificar e instalar dependências
if not exist "node_modules" (
    echo Instalando dependências do frontend...
    call npm install
)

echo Iniciando Vite dev server...
call npm run dev

pause
