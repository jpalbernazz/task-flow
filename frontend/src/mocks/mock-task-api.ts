import type { TaskApiModel } from "@/lib/tasks/types"

export const mockTaskApi: TaskApiModel[] = [
  {
    id: 1,
    title: "Mapear jornadas de usuario",
    description: "Documentar os fluxos principais para o novo dashboard.",
    status: "todo",
    priority: "high",
    due_date: "2026-04-12",
    assigned_user_id: 1,
    project_id: 1,
  },
  {
    id: 2,
    title: "Criar wireframes da home",
    description: "Prototipo de baixa fidelidade da pagina inicial.",
    status: "in_progress",
    priority: "medium",
    due_date: "2026-04-09",
    assigned_user_id: 2,
    project_id: 1,
  },
  {
    id: 3,
    title: "Revisar paleta de cores",
    description: "Validar contraste e acessibilidade do tema.",
    status: "done",
    priority: "low",
    due_date: "2026-04-05",
    assigned_user_id: 3,
    project_id: 1,
  },
]
