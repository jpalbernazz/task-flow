"use client"

import { Button } from "@/components/ui/Button"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarPageFeedback() {
  const {
    errorMessage,
    infoMessage,
    refreshCalendarTasks,
    viewState,
  } = useCalendarPageContext()

  return (
    <>
      {viewState.hasError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refreshCalendarTasks()}
              disabled={viewState.isRefreshing}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : null}

      {viewState.hasInfo ? (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          {infoMessage}
        </div>
      ) : null}

      {viewState.isRefreshing ? (
        <p className="text-sm text-muted-foreground">Carregando calendario...</p>
      ) : null}
    </>
  )
}
