"use client"

import { Badge } from "@/components/ui/badge"
import {
  formatDateLabel,
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from "@/lib/calendar/calendar-utils"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarUpcomingDeadlines() {
  const { upcomingDeadlines } = useCalendarPageContext()

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">Proximos Prazos</h3>
      {upcomingDeadlines.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nao ha prazos futuros cadastrados.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {upcomingDeadlines.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateLabel(task.dueDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
                <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
