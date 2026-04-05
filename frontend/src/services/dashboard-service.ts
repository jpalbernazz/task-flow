import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"

const dashboardStats: DashboardStat[] = [
  {
    title: "Total de Tarefas",
    value: 42,
    description: "Todas as tarefas ativas",
    icon: "list",
    variant: "primary",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Em Progresso",
    value: 18,
    description: "Tarefas em andamento",
    icon: "clock",
    variant: "primary",
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Concluidas",
    value: 156,
    description: "Este mes",
    icon: "check",
    variant: "success",
    trend: { value: 24, isPositive: true },
  },
  {
    title: "Atrasadas",
    value: 3,
    description: "Requerem atencao",
    icon: "alert",
    variant: "destructive",
    trend: { value: 2, isPositive: false },
  },
]

const recentTasks: RecentTaskItem[] = [
  {
    id: "1",
    title: "Criar wireframes da pagina inicial",
    project: "Redesign do Site",
    status: "in-progress",
    priority: "high",
    dueDate: "Hoje",
    assignee: { name: "Maria Silva", initials: "MS" },
  },
  {
    id: "2",
    title: "Revisar documentacao da API",
    project: "API de Backend",
    status: "todo",
    priority: "medium",
    dueDate: "Amanha",
    assignee: { name: "Pedro Santos", initials: "PS" },
  },
  {
    id: "3",
    title: "Implementar autenticacao OAuth",
    project: "Aplicativo Mobile",
    status: "overdue",
    priority: "high",
    dueDate: "Ontem",
    assignee: { name: "Ana Costa", initials: "AC" },
  },
]

export function getDashboardStats(): DashboardStat[] {
  return dashboardStats
}

export function getRecentTasks(): RecentTaskItem[] {
  return recentTasks
}
