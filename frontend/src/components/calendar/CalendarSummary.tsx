"use client"

import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

interface SummaryCardProps {
  label: string
  value: number
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function CalendarSummary() {
  const { monthSummary } = useCalendarPageContext()

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Tarefas no mes" value={monthSummary.tasksInMonth} />
      <SummaryCard label="Dias com tarefas" value={monthSummary.daysWithTasks} />
      <SummaryCard label="Atrasadas no mes" value={monthSummary.overdueTasks} />
      <SummaryCard label="Proximas no mes" value={monthSummary.upcomingTasks} />
    </div>
  )
}
