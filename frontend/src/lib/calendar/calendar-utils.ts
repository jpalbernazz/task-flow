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
  alta: "bg-destructive text-destructive-foreground",
  media: "bg-warning text-warning-foreground",
  baixa: "bg-muted text-muted-foreground",
} as const

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

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

export function getTasksForDay(tasks: CalendarTask[], year: number, month: number, day: number) {
  const dateKey = formatDateKey(year, month, day)
  return tasks.filter((task) => task.date === dateKey)
}

export function getUpcomingDeadlines(tasks: CalendarTask[], limit = 3) {
  return tasks.filter((task) => task.type === "prazo").slice(0, limit)
}
