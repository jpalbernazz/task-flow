# Backend API

## Rodando a API

1. `cp .env.template .env`
2. `npm install`
3. `npm run dev`

## Estrutura por dominio

- `src/modules/tasks/controllers` -> camada HTTP (request/response)
- `src/modules/tasks/validators` -> validacao de payload e params
- `src/modules/tasks/services` -> regras de negocio da feature
- `src/modules/tasks/repositories` -> acesso ao banco (SQL)
- `src/modules/tasks/mappers` -> mapeamento entre entity (snake_case) e dto (camelCase)
- `src/modules/tasks/types` -> contratos internos da feature
- `src/shared/http` -> erro de aplicacao e middleware global
- `src/database` -> conexao e scripts SQL versionados

## Banco de dados (PostgreSQL)

Estrutura de scripts:

- `src/database/migrations` -> criacao/evolucao de estrutura
- `src/database/seeds` -> dados iniciais
- `src/database/scripts` -> utilitarios (ex: reset)

Comandos:

- `npm run db:migrate` -> aplica migrations
- `npm run db:seed` -> aplica seeds
- `npm run db:setup` -> migrate + seed
- `npm run db:reset` -> drop de tabelas
- `npm run db:rebuild` -> reset + migrate + seed

Uso no DBeaver:

- Para aplicacao manual, use `src/database/schema.sql`.
- Para manter padrao do projeto, prefira executar os comandos npm acima.

## Endpoints

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

## Contrato de Tasks

API HTTP de tasks usa `camelCase`.
`snake_case` e mantido apenas na camada de persistencia (banco/repositorio).

Payload de escrita para `POST /tasks` e `PUT /tasks/:id`:

```json
{
  "title": "Planejar sprint",
  "description": "Definir backlog da proxima sprint",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-04-10",
  "projectId": 1
}
```

`projectId` e opcional e aceita `null`.

## Contrato de Projects

API HTTP de projects usa `camelCase`.
`snake_case` e mantido apenas na camada de persistencia (banco/repositorio).

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
