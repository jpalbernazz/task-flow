# Backend API - Task Flow

API REST em Node.js + Express para autenticação, usuários, tarefas e projetos.

## Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- `pg` para acesso ao banco
- `multer` para upload de avatar

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Variáveis de Ambiente

Crie o arquivo local:

```bash
cp .env.template .env
```

Template:

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=task_flow
PGUSER=postgres
PGPASSWORD=postgres
SESSION_COOKIE_NAME=taskflow_session
SESSION_TTL_DAYS=7
RESET_PASSWORD_TTL_MINUTES=60
AVATAR_MAX_SIZE_MB=2
AVATAR_UPLOADS_DIR=uploads/avatars
```

`FRONTEND_ORIGIN` aceita múltiplas origens separadas por vírgula.

## Instalação e Execução

```bash
npm install
npm run db:setup
npm run dev
```

Servidor padrão em `http://localhost:3001`.

Health check:

- `GET /health`

## Scripts

- `npm run dev`: inicia API em modo desenvolvimento (`tsx watch`)
- `npm run start`: inicia API sem watch
- `npm run db:migrate`: executa migrations
- `npm run db:seed`: executa seeds
- `npm run db:reset`: executa scripts de reset
- `npm run db:setup`: migrations + seeds
- `npm run db:rebuild`: reset + migrations + seeds

## Estrutura de Pastas

- `src/modules`: módulos de domínio
- `src/modules/*/controllers`: camada HTTP
- `src/modules/*/validators`: validação de payload/params
- `src/modules/*/services`: regras de negócio
- `src/modules/*/repositories`: acesso a banco
- `src/modules/*/mappers`: transformação entity/dto
- `src/shared`: middleware, erros e utilitários compartilhados
- `src/database`: conexão, migrations, seeds e scripts

## Banco de Dados

- `src/database/migrations`: evolução de estrutura
- `src/database/seeds`: dados iniciais
- `src/database/scripts`: utilitários SQL (ex.: reset)
- `src/database/schema.sql`: snapshot para referência/aplicação manual

Para manter o padrão do projeto, prefira os scripts npm (`db:*`).

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Tasks (requer autenticação)

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/reorder`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Projects (requer autenticação)

- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

### Users (requer autenticação)

- `PATCH /users/me`
- `PATCH /users/me/password`
- `POST /users/me/avatar`

## Sessão, Autenticação e Upload

- Sessão via cookie HTTP-only.
- Rotas de `tasks`, `projects` e `users` retornam `401` sem sessão válida.
- Upload de avatar com `multipart/form-data` e campo `avatar`.
- Avatares são salvos em `uploads/avatars` e servidos em `/uploads/avatars/*`.

## Recuperação de Senha

- `POST /auth/forgot-password` retorna `resetUrl` para uso local no frontend.
- Validade do token configurada por `RESET_PASSWORD_TTL_MINUTES`.

## Modelo de Workspace (MVP)

- Workspace compartilhado por instância.
- Todos os usuários autenticados visualizam/gerenciam o mesmo conjunto de tarefas e projetos.
- Não há autorização por dono (`owner`) nesta etapa.

## Contrato da API

A API expõe dados em `camelCase`.
`snake_case` fica restrito à camada de persistência.

### Exemplo de payload de task

`POST /tasks` e `PUT /tasks/:id`

```json
{
  "title": "Planejar sprint",
  "description": "Definir backlog da próxima sprint",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-04-10",
  "projectId": 1
}
```

`projectId` é opcional e aceita `null`.

### Exemplo de payload de project

`POST /projects` e `PUT /projects/:id`

```json
{
  "name": "Redesign do Site",
  "description": "Atualizar identidade visual e UX",
  "status": "em-andamento",
  "deadline": "2026-04-20",
  "progress": 65,
  "tasksCompleted": 18,
  "totalTasks": 28
}
```

## Usuário Seed (Desenvolvimento)

Após `npm run db:setup`:

- email: `admin@taskflow.local`
- senha: `admin123`
