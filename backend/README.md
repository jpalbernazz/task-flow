# Backend API

## Rodando a API

1. `cp .env.example .env`
2. `npm install`
3. `npm run dev`

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
