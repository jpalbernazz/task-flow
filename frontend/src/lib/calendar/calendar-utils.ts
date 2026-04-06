import type { CalendarTask } from "./types"

export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
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
  medium: "bg-amber-100 text-amber-700",
  low: "bg-muted text-muted-foreground",
} as const

export const priorityLabels = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
} as const

export const statusLabels = {
  todo: "A Fazer",
  in_progress: "Em Progresso",
  done: "Concluida",
} as const

export const statusColors = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
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

export function buildTasksByDateMap(tasks: CalendarTask[]): Record<string, CalendarTask[]> {
  return tasks.reduce<Record<string, CalendarTask[]>>((accumulator, task) => {
    if (!accumulator[task.dueDate]) {
      accumulator[task.dueDate] = []
    }

    accumulator[task.dueDate].push(task)
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

  const tasksInMonth = tasks.filter((task) => task.dueDate.startsWith(monthPrefix))
  const daysWithTasks = Object.keys(tasksByDate).filter((dateKey) => dateKey.startsWith(monthPrefix)).length
  const overdueTasks = tasksInMonth.filter((task) => task.dueDate < todayDateKey && task.status !== "done").length
  const upcomingTasks = tasksInMonth.filter((task) => task.dueDate >= todayDateKey).length

  return {
    tasksInMonth: tasksInMonth.length,
    daysWithTasks,
    overdueTasks,
    upcomingTasks,
  }
}

export function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-")
  return `${day}/${month}/${year}`
}

export function getUpcomingDeadlines(tasks: CalendarTask[], limit = 3) {
  const todayKey = getTodayDateKey()

  return tasks
    .filter((task) => task.dueDate >= todayKey)
    .sort((taskA, taskB) => taskA.dueDate.localeCompare(taskB.dueDate))
    .slice(0, limit)
}
