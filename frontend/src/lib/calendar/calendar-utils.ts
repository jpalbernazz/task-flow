import type { CalendarTask } from "./types"

export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export const priorityColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-warning/15 text-warning",
  low: "bg-muted text-muted-foreground",
} as const

export const priorityLabels = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
} as const

export const statusLabels = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  done: "Concluída",
} as const

export const statusColors = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  done: "bg-success/10 text-success",
} as const

export interface CalendarMonthSummary {
  tasksInMonth: number
  daysWithTasks: number
  overdueTasks: number
  upcomingTasks: number
}

export function getMonthContext(currentDate: Date) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  return {
    year,
    month,
    startingDayOfWeek: firstDayOfMonth.getDay(),
    daysInMonth: lastDayOfMonth.getDate(),
  }
}

export function buildCalendarDays(startingDayOfWeek: number, daysInMonth: number): Array<number | null> {
  const calendarDays: Array<number | null> = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  while (calendarDays.length < 42) {
    calendarDays.push(null)
  }

  return calendarDays
}

export function getDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

export function getTodayDateKey(today = new Date()): string {
  return getDateKey(today.getFullYear(), today.getMonth(), today.getDate())
}

function normalizeDateKey(value: string): string | null {
  const normalized = value.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null
  }

  return normalized
}

export function buildTasksByDateMap(tasks: CalendarTask[]): Record<string, CalendarTask[]> {
  return tasks.reduce<Record<string, CalendarTask[]>>((accumulator, task) => {
    const dueDateKey = normalizeDateKey(task.dueDate)
    if (!dueDateKey) {
      return accumulator
    }

    if (!accumulator[dueDateKey]) {
      accumulator[dueDateKey] = []
    }

    accumulator[dueDateKey].push(task)
    return accumulator
  }, {})
}

export function getTasksForDay(tasksByDate: Record<string, CalendarTask[]>, year: number, month: number, day: number) {
  const dateKey = getDateKey(year, month, day)
  return tasksByDate[dateKey] ?? []
}

export function getMonthSummary(
  tasks: CalendarTask[],
  tasksByDate: Record<string, CalendarTask[]>,
  year: number,
  month: number,
  todayDateKey = getTodayDateKey()
): CalendarMonthSummary {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`

  const tasksInMonth = tasks.filter((task) => {
    const dueDateKey = normalizeDateKey(task.dueDate)
    return dueDateKey?.startsWith(monthPrefix) ?? false
  })
  const daysWithTasks = Object.keys(tasksByDate).filter((dateKey) => dateKey.startsWith(monthPrefix)).length
  const overdueTasks = tasksInMonth.filter((task) => {
    const dueDateKey = normalizeDateKey(task.dueDate)
    return dueDateKey !== null && dueDateKey < todayDateKey && task.status !== "done"
  }).length
  const upcomingTasks = tasksInMonth.filter((task) => {
    const dueDateKey = normalizeDateKey(task.dueDate)
    return dueDateKey !== null && dueDateKey >= todayDateKey && task.status !== "done"
  }).length

  return {
    tasksInMonth: tasksInMonth.length,
    daysWithTasks,
    overdueTasks,
    upcomingTasks,
  }
}

export function formatDateLabel(dateKey: string): string {
  const normalizedDateKey = normalizeDateKey(dateKey)
  if (!normalizedDateKey) {
    return dateKey
  }

  const [year, month, day] = normalizedDateKey.split("-")
  return `${day}/${month}/${year}`
}

export function getRelativeDateLabel(dateKey: string, todayDateKey = getTodayDateKey()): string | null {
  const normalizedDateKey = normalizeDateKey(dateKey)
  if (!normalizedDateKey) {
    return null
  }

  if (normalizedDateKey === todayDateKey) {
    return "Hoje"
  }

  const dueDateObject = new Date(`${normalizedDateKey}T00:00:00`)
  const todayDateObject = new Date(`${todayDateKey}T00:00:00`)
  const diffInMs = dueDateObject.getTime() - todayDateObject.getTime()
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 1) {
    return "Amanhã"
  }

  if (diffInDays === -1) {
    return "Ontem"
  }

  if (diffInDays > 1) {
    return `Em ${diffInDays} dias`
  }

  return `${Math.abs(diffInDays)} dias atrás`
}

export function getUpcomingDeadlines(tasks: CalendarTask[], limit = 3) {
  const todayKey = getTodayDateKey()

  return tasks
    .filter((task) => {
      const dueDateKey = normalizeDateKey(task.dueDate)
      return dueDateKey !== null && dueDateKey >= todayKey && task.status !== "done"
    })
    .sort((taskA, taskB) => {
      const taskADateKey = normalizeDateKey(taskA.dueDate) ?? "9999-12-31"
      const taskBDateKey = normalizeDateKey(taskB.dueDate) ?? "9999-12-31"
      return taskADateKey.localeCompare(taskBDateKey)
    })
    .slice(0, limit)
}
