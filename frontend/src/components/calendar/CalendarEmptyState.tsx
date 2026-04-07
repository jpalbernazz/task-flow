"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarEmptyState() {
  const {
    calendarUiState,
  } = useCalendarPageContext()

  if (!calendarUiState.isGlobalEmpty) {
    return null
  }

  return (
    <div className="rounded-2xl border border-dashed bg-card p-4 text-sm text-muted-foreground shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>Nenhuma tarefa encontrada. Crie tarefas com data para visualizar no calendário.</p>
        <Button size="sm" asChild>
          <Link href="/tasks?create=true">Criar tarefa</Link>
        </Button>
      </div>
    </div>
  )
}
