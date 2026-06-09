# Integração Frontend-Backend - Guia Rápido

## 🚀 O que foi implementado

### Backend (Java Spring Boot)

```
✅ CORS Configuration - Permite requisições do frontend
✅ Auth Controller - Endpoints /api/auth/login e /api/auth/register
✅ Usuario Service - Método findByEmail para login
✅ Repositório - Suporte a busca por email
```

### Frontend (React + TypeScript)

```
✅ API Service Layer (src/services/api.ts)
   - Requisições HTTP com tratamento de erros
   - Autenticação com token JWT/Bearer
   - Gerenciamento de dados no localStorage

✅ LoginPage - Integrada com API
   - Login com email/senha
   - Cadastro de novos usuários
   - Salvamento de sessão

✅ Dashboard - Integrada com API
   - Carregamento de solicitações em tempo real
   - Criação de novas solicitações
   - Filtros por status
   - Dados do usuário autenticado
```

## 🔧 Configuração

### Variáveis de Ambiente (Frontend)

Arquivo: `frontend/.env.local`

```
VITE_API_URL=http://localhost:8080/api
```

### CORS (Backend)

Permite requisições de:

- http://localhost:5173 (Vite dev)
- http://localhost:3000 (production)
- http://127.0.0.1:5173
- http://127.0.0.1:3000

## 📡 Endpoints Disponíveis

### Autenticação

- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/register` - Criar novo usuário
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual (TODO)

### Usuários

- `GET /api/usuarios` - Listar todos
- `GET /api/usuarios/{id}` - Buscar por ID
- `POST /api/usuarios` - Criar
- `PUT /api/usuarios/{id}` - Atualizar
- `DELETE /api/usuarios/{id}` - Deletar

### Solicitações

- `GET /api/solicitacoes` - Listar todas
- `GET /api/solicitacoes/{id}` - Buscar por ID
- `POST /api/solicitacoes` - Criar nova
- `PUT /api/solicitacoes/{id}` - Atualizar
- `DELETE /api/solicitacoes/{id}` - Deletar

### Endereços

- `GET /api/enderecos`
- `POST /api/enderecos`
- `PUT /api/enderecos/{id}`
- `DELETE /api/enderecos/{id}`

### Anexos

- `GET /api/anexos`
- `POST /api/anexos`
- `DELETE /api/anexos/{id}`

## 🔐 Autenticação

### Flow

1. Usuário faz login/registro
2. Backend retorna `usuario` + `token`
3. Frontend salva em `localStorage`:
   - `authToken` - Token para requisições
   - `usuario` - Dados do usuário

### Headers de Requisição

```
Authorization: Bearer <token>
Content-Type: application/json
```

## 🛠️ Como Usar a API Service

```typescript
import { authService, solicitacaoService } from "@/services/api";

// Login
const response = await authService.login("email@example.com", "senha");
authService.saveAuth(response.usuario, response.token);

// Carregar solicitações
const solicitacoes = await solicitacaoService.getAll();

// Criar solicitação
await solicitacaoService.create({
  categoria: "ILUMINACAO_PUBLICA",
  descricao: "Poste apagado",
  prioridade: "MEDIA",
  endereco: "Rua das Flores, 100",
});

// Verificar autenticação
if (authService.isAuthenticated()) {
  const usuario = authService.getCurrentUser();
  console.log(usuario.nome);
}
```

## 🐛 Próximos Passos

### Melhorias Recomendadas

- [ ] Implementar autenticação JWT real (não UUID temporário)
- [ ] Criptografar senhas com BCrypt
- [ ] Adicionar refresh token
- [ ] Implementar validação de sessão
- [ ] Adicionar tratamento de erro 401/403
- [ ] Implementar upload de anexos
- [ ] Adicionar busca/filtros avançados
- [ ] Implementar paginação

### Segurança

- [ ] HTTPS em produção
- [ ] Rate limiting na API
- [ ] Validação de CSRF
- [ ] SQL injection protection
- [ ] Input sanitization

## 📝 Estrutura de Dados

### Usuario

```typescript
{
  id: number;
  nome: string;
  email: string;
  numeroTelefone?: string;
  cargo?: string;
  tipo: 'CIDADAO' | 'FUNCIONARIO_PUBLICO' | 'GESTOR';
}
```

### Solicitacao

```typescript
{
  id: number;
  categoria: CategoriaSolicitacao;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  status: 'ABERTO' | 'EM_TRIAGEM' | 'EM_EXECUCAO' | 'CONCLUIDO';
  endereco?: string;
  telefone?: string;
  anonima: boolean;
  dataAbertura: string;
  protocoloNumero?: string;
}
```

## 🚢 Deploy

### Backend

```bash
cd backend/server
mvn clean package
java -jar target/observacao-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm install
npm run build
# Servir a pasta 'dist'
```

---

**Data**: 2026-06-09
**Status**: ✅ Integração Completa
