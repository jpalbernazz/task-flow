"use client"

import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarEmptyState() {
  const {
    calendarTasks,
    viewState,
  } = useCalendarPageContext()

  if (viewState.isRefreshing || viewState.hasError || calendarTasks.length !== 0) {
    return null
  }

  return (
    <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
      Nenhuma tarefa encontrada. Crie tarefas com data para visualizar no calendario.
    </div>
  )
}
