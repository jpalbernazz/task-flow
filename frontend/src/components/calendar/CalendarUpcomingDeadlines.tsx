"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  formatDateLabel,
  getRelativeDateLabel,
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from "@/lib/calendar/calendar-utils"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarUpcomingDeadlines() {
  const { upcomingDeadlines } = useCalendarPageContext()

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-semibold">Próximos Prazos</h3>
        <Button variant="ghost" size="xs" asChild>
          <Link href="/tasks">Ver todas</Link>
        </Button>
      </div>

      {upcomingDeadlines.length === 0 ? (
        <p className="text-sm text-muted-foreground">Não há prazos futuros cadastrados.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {upcomingDeadlines.map((task) => {
            const relativeDateLabel = getRelativeDateLabel(task.dueDate)

            return (
              <article key={task.id} className="rounded-xl border border-border/80 bg-background/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDateLabel(task.dueDate)}</span>
                      {relativeDateLabel ? (
                        <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">
                          {relativeDateLabel}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <Button variant="outline" size="xs" asChild>
                    <Link href={`/tasks?edit=${task.id}`}>Editar</Link>
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
                  <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
