# Frontend - Task Flow

Aplicação web em Next.js responsável pela interface de autenticação, dashboard, tarefas, projetos, calendário e configurações do usuário.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Pré-requisitos

- Node.js 20+
- npm 10+
- Backend da API em execução (por padrão em `http://localhost:3001`)

## Variáveis de Ambiente

Crie o arquivo local:

```bash
cp .env.template .env
```

Conteúdo esperado:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Instalação e Execução

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento
- `npm run build`: gera build de produção
- `npm run start`: inicia app em modo produção
- `npm run lint`: executa lint do projeto

## Estrutura

- `src/app`: rotas e páginas
- `src/components`: componentes reutilizáveis e seções
- `src/services`: chamadas HTTP para o backend
- `src/lib`: hooks e lógica compartilhada
- `src/mocks`: dados de apoio para desenvolvimento
- `public`: assets estáticos

## Rotas de Tela

- `/login`
- `/criar-conta`
- `/esqueci-senha`
- `/redefinir-senha`
- `/dashboard`
- `/tasks`
- `/projects`
- `/calendar`
- `/settings`

## Integração com Backend

- As chamadas de API ficam em `src/services`.
- O cliente HTTP usa `credentials: "include"` para trabalhar com cookie de sessão HTTP-only.
- Para funcionar corretamente em desenvolvimento:
  - frontend em `http://localhost:3000`
  - backend em `http://localhost:3001`
