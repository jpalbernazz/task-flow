import type { TaskViewModel } from "@/lib/tasks/types"

export const mockTaskApi: TaskViewModel[] = [
  {
    id: 1,
    title: "Mapear jornadas de usuário",
    description: "Documentar os fluxos principais para o novo dashboard.",
    status: "todo",
    priority: "high",
    dueDate: "2026-04-12",
    projectId: null,
    position: 0,
  },
  {
    id: 2,
    title: "Criar wireframes da home",
    description: "Protótipo de baixa fidelidade da página inicial.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-04-09",
    projectId: null,
    position: 0,
  },
  {
    id: 3,
    title: "Revisar paleta de cores",
    description: "Validar contraste e acessibilidade do tema.",
    status: "done",
    priority: "low",
    dueDate: "2026-04-05",
    projectId: null,
    position: 0,
  },
]
