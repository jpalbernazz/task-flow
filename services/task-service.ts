import type { KanbanColumnConfig, Task, TaskStatus } from "@/types/task"

export const initialKanbanTasks: Task[] = [
  {
    id: "1",
    title: "Criar wireframes do dashboard",
    assignee: { name: "Ana Silva", avatar: "AS" },
    dueDate: "2026-04-10",
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    title: "Revisar documentacao da API",
    assignee: { name: "Carlos Lima", avatar: "CL" },
    dueDate: "2026-04-08",
    priority: "medium",
    status: "todo",
  },
  {
    id: "3",
    title: "Configurar ambiente de testes",
    assignee: { name: "Maria Santos", avatar: "MS" },
    dueDate: "2026-04-12",
    priority: "low",
    status: "todo",
  },
  {
    id: "4",
    title: "Implementar autenticacao JWT",
    assignee: { name: "Pedro Costa", avatar: "PC" },
    dueDate: "2026-04-05",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "5",
    title: "Desenvolver componentes UI",
    assignee: { name: "Ana Silva", avatar: "AS" },
    dueDate: "2026-04-07",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "6",
    title: "Definir arquitetura do projeto",
    assignee: { name: "Carlos Lima", avatar: "CL" },
    dueDate: "2026-04-01",
    priority: "high",
    status: "done",
  },
  {
    id: "7",
    title: "Setup inicial do repositorio",
    assignee: { name: "Maria Santos", avatar: "MS" },
    dueDate: "2026-03-28",
    priority: "low",
    status: "done",
  },
]

export const kanbanColumns: KanbanColumnConfig[] = [
  { id: "todo", title: "A Fazer", color: "bg-muted-foreground/20" },
  { id: "in-progress", title: "Em Progresso", color: "bg-primary/20" },
  { id: "done", title: "Concluido", color: "bg-success/20" },
]

export function groupTasksByStatus(tasks: Task[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status)
}
