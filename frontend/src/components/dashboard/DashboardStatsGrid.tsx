"use client"

import { AlertTriangle, CheckCircle2, Clock, FolderOpen, ListTodo } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { useDashboardPageContext } from "@/lib/dashboard/dashboard-page-context"

const iconMap = {
  list: ListTodo,
  clock: Clock,
  check: CheckCircle2,
  alert: AlertTriangle,
  folder: FolderOpen,
}

export function DashboardStatsGrid() {
  const { stats, viewState } = useDashboardPageContext()

  if (!viewState.isRefreshing && !viewState.hasError && stats.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Nenhum indicador disponível no momento.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon]
        return (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={Icon}
            variant={stat.variant}
            trend={stat.trend}
          />
        )
      })}
    </div>
  )
}
