# Task Flow

Aplicação full stack de gestão de tarefas e projetos, desenvolvida para organização de atividades em formato de dashboard com autenticação, prioridades, calendário e gestão de perfil.

## Visão Geral

O repositório está dividido em dois aplicativos independentes:

- `frontend/`: Next.js + React + TypeScript + Tailwind CSS
- `backend/`: Node.js + Express + PostgreSQL

Essa separação é intencional e deve ser mantida em toda evolução do projeto.

## Arquitetura

### Frontend

- `frontend/src/app`: rotas e composição de páginas
- `frontend/src/components`: componentes reutilizáveis e seções de tela
- `frontend/src/services`: comunicação com a API
- `frontend/src/lib`: hooks, helpers e lógica compartilhada de frontend
- `frontend/src/mocks`: dados de apoio para dev/testes

### Backend

- `backend/src/modules`: módulos de domínio (auth, users, tasks, projects)
- `backend/src/shared`: utilitários e cross-cutting concerns
- `backend/src/database`: conexão, migrations, seeds e scripts SQL
- `backend/src/server.ts`: bootstrap da API

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Configuração Rápida (Ambiente Local)

1. Clonar o projeto e entrar na pasta raiz.
2. Configurar variáveis de ambiente:
   - `cp backend/.env.template backend/.env`
   - `cp frontend/.env.template frontend/.env`
3. Instalar dependências:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
4. Preparar banco de dados:
   - `npm run backend:db:setup`
5. Subir backend:
   - `npm run backend:dev`
6. Em outro terminal, subir frontend:
   - `npm run frontend:dev`

URLs locais:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check da API: `GET http://localhost:3001/health`

## Scripts Úteis (Raiz)

- `npm run frontend:dev`
- `npm run frontend:build`
- `npm run frontend:start`
- `npm run frontend:lint`
- `npm run backend:dev`
- `npm run backend:start`
- `npm run backend:db:migrate`
- `npm run backend:db:seed`
- `npm run backend:db:setup`
- `npm run backend:db:rebuild`

## Usuário Seed de Desenvolvimento

Após `npm run backend:db:setup`:

- email: `admin@taskflow.local`
- senha: `admin123`

## Documentação por Aplicação

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
