import type { ProjectCardItem } from "@/lib/projects/types"
import type { TaskViewModel } from "@/lib/tasks/types"
import type { DashboardStat, RecentTaskItem, RecentTaskStatus } from "./types"

const MAX_RECENT_TASKS = 6

function normalizeDateKey(value: string): string | null {
  const normalized = value.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null
  }

  return normalized
}

function isTaskOverdue(task: TaskViewModel, todayDateKey: string): boolean {
  const dueDateKey = normalizeDateKey(task.dueDate)
  if (!dueDateKey) {
    return false
  }

  return dueDateKey < todayDateKey && task.status !== "done"
}

function mapTaskToRecentStatus(task: TaskViewModel, overdue: boolean): RecentTaskStatus {
  if (overdue) {
    return "overdue"
  }

  if (task.status === "done") {
    return "completed"
  }

  if (task.status === "in_progress") {
    return "in-progress"
  }

  return "todo"
}

function formatDueDateLabel(dueDate: string, todayDateKey: string): string {
  const dueDateKey = normalizeDateKey(dueDate)
  if (!dueDateKey) {
    return dueDate
  }

  if (dueDateKey === todayDateKey) {
    return "Hoje"
  }

  const dueDateObject = new Date(`${dueDateKey}T00:00:00`)
  const todayDateObject = new Date(`${todayDateKey}T00:00:00`)
  const diffInMs = dueDateObject.getTime() - todayDateObject.getTime()
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 1) {
    return "Amanha"
  }

  if (diffInDays === -1) {
    return "Ontem"
  }

  const [year, month, day] = dueDateKey.split("-")
  return `${day}/${month}/${year}`
}

function buildProjectsById(projects: ProjectCardItem[]): Record<number, ProjectCardItem> {
  return projects.reduce<Record<number, ProjectCardItem>>((accumulator, project) => {
    accumulator[project.id] = project
    return accumulator
  }, {})
}

function compareTasksByRelevance(taskA: TaskViewModel, taskB: TaskViewModel): number {
  const taskAIsDone = taskA.status === "done"
  const taskBIsDone = taskB.status === "done"

  if (taskAIsDone !== taskBIsDone) {
    return taskAIsDone ? 1 : -1
  }

  const taskADateKey = normalizeDateKey(taskA.dueDate) ?? "9999-12-31"
  const taskBDateKey = normalizeDateKey(taskB.dueDate) ?? "9999-12-31"
  return taskADateKey.localeCompare(taskBDateKey)
}

export function getTodayDateKey(today = new Date()): string {
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function buildDashboardStats(
  tasks: TaskViewModel[],
  projects: ProjectCardItem[],
  todayDateKey: string
): DashboardStat[] {
  const tasksInProgress = tasks.filter((task) => task.status === "in_progress").length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const overdueTasks = tasks.filter((task) => isTaskOverdue(task, todayDateKey)).length

  return [
    {
      title: "Total de Tarefas",
      value: tasks.length,
      description: "Todas as tarefas",
      icon: "list",
      variant: "primary",
    },
    {
      title: "Em Progresso",
      value: tasksInProgress,
      description: "Tarefas em andamento",
      icon: "clock",
      variant: "primary",
    },
    {
      title: "Concluidas",
      value: completedTasks,
      description: "Tarefas finalizadas",
      icon: "check",
      variant: "success",
    },
    {
      title: "Atrasadas",
      value: overdueTasks,
      description: "Tarefas fora do prazo",
      icon: "alert",
      variant: "destructive",
    },
    {
      title: "Total de Projetos",
      value: projects.length,
      description: "Projetos ativos",
      icon: "folder",
      variant: "primary",
    },
  ]
}

export function buildRecentTasks(
  tasks: TaskViewModel[],
  projects: ProjectCardItem[],
  todayDateKey: string
): RecentTaskItem[] {
  const projectsById = buildProjectsById(projects)

  return tasks
    .slice()
    .sort(compareTasksByRelevance)
    .slice(0, MAX_RECENT_TASKS)
    .map((task) => {
      const overdue = isTaskOverdue(task, todayDateKey)
      const status = mapTaskToRecentStatus(task, overdue)
      const projectName = task.projectId === null ? "Sem projeto" : (projectsById[task.projectId]?.name ?? "Projeto removido")

      return {
        id: String(task.id),
        title: task.title,
        project: projectName,
        status,
        priority: task.priority,
        dueDate: formatDueDateLabel(task.dueDate, todayDateKey),
        assignee: { name: "Sistema", initials: "SI" },
      }
    })
}
