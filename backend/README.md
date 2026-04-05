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
- `src/modules/tasks/mappers` -> mapeamento entre entity/dto/api model
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
