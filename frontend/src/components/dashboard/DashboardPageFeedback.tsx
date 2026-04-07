"use client"

import { Button } from "@/components/ui/button"
import { useDashboardPageContext } from "@/lib/dashboard/dashboard-page-context"

export function DashboardPageFeedback() {
  const {
    errorMessage,
    infoMessage,
    refreshDashboard,
    viewState,
  } = useDashboardPageContext()

  return (
    <>
      {viewState.hasError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refreshDashboard()}
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

      {viewState.isRefreshing ? <p className="text-sm text-muted-foreground">Carregando painel...</p> : null}
    </>
  )
}
