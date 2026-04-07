# Backend API

## Rodando a API

1. `cp .env.template .env`
2. `npm install`
3. `npm run dev`

## Estrutura por domínio

- `src/modules/tasks/controllers` -> camada HTTP (request/response)
- `src/modules/tasks/validators` -> validação de payload e params
- `src/modules/tasks/services` -> regras de negócio da feature
- `src/modules/tasks/repositories` -> acesso ao banco (SQL)
- `src/modules/tasks/mappers` -> mapeamento entre entity (snake_case) e dto (camelCase)
- `src/modules/tasks/types` -> contratos internos da feature
- `src/shared/http` -> erro de aplicação e middleware global
- `src/database` -> conexão e scripts SQL versionados

## Banco de dados (PostgreSQL)

Estrutura de scripts:

- `src/database/migrations` -> criação/evolução de estrutura
- `src/database/seeds` -> dados iniciais
- `src/database/scripts` -> utilitários (ex: reset)

Comandos:

- `npm run db:migrate` -> aplica migrations
- `npm run db:seed` -> aplica seeds
- `npm run db:setup` -> migrate + seed
- `npm run db:reset` -> drop de tabelas
- `npm run db:rebuild` -> reset + migrate + seed

Uso no DBeaver:

- Para aplicação manual, use `src/database/schema.sql`.
- Para manter padrão do projeto, prefira executar os comandos npm acima.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `PATCH /users/me`
- `POST /users/me/avatar`

## Modelo de Workspace

- Este MVP usa **workspace compartilhado** por instância.
- Todos os usuários autenticados veem e gerenciam o mesmo conjunto de `tasks` e `projects`.
- Não existe autorização por proprietário (`owner`) nesta fase.

## Usuário padrão para desenvolvimento

Após `npm run db:setup`, o seed cria:

- email: `admin@taskflow.local`
- senha: `admin123`

## Sessão e upload

- A autenticação usa cookie HTTP-only de sessão.
- Cadastro cria conta pronta para login.
- Rotas de `tasks`, `projects` e `users` exigem autenticação (`401` sem sessão válida).
- O upload de avatar usa `multipart/form-data` com campo `avatar`.
- Arquivos de avatar ficam em `backend/uploads/avatars` e são servidos em `/uploads/avatars/*`.

## Recuperação de senha

- `POST /auth/forgot-password` retorna `resetUrl` para uso local no frontend.
- `RESET_PASSWORD_TTL_MINUTES` define a expiração do token de redefinição.

## Contrato de Tasks

API HTTP de tasks usa `camelCase`.
`snake_case` é mantido apenas na camada de persistência (banco/repositório).

Payload de escrita para `POST /tasks` e `PUT /tasks/:id`:

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

## Contrato de Projects

API HTTP de projects usa `camelCase`.
`snake_case` é mantido apenas na camada de persistência (banco/repositório).

Payload de escrita para `POST /projects` e `PUT /projects/:id`:

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

## Fluxo Local com Frontend

1. Backend: `cp .env.template .env`
2. Backend: `npm install`
3. Backend: `npm run db:setup`
4. Backend: `npm run dev`
5. Frontend: criar `frontend/.env` a partir de `frontend/.env.template`
6. Frontend: `npm install`
7. Frontend: `npm run dev`
