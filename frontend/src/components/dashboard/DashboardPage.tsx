"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Clock, FolderOpen, ListTodo, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { TaskList } from "@/components/dashboard/TaskList"
import { Button } from "@/components/ui/Button"
import { getErrorMessage } from "@/lib/get-error-message"
import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"
import { getDashboardData } from "@/services/dashboard-service"

const iconMap = {
  list: ListTodo,
  clock: Clock,
  check: CheckCircle2,
  alert: AlertTriangle,
  folder: FolderOpen,
}

export function DashboardPageView() {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [recentTasks, setRecentTasks] = useState<RecentTaskItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = await getDashboardData()
      setStats(data.stats)
      setRecentTasks(data.recentTasks)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel carregar os dados do painel."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void loadDashboard()} disabled={isLoading}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : null}

        {isLoading ? <p className="text-sm text-muted-foreground">Carregando painel...</p> : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Painel</h1>
            <p className="text-muted-foreground">Bem-vindo de volta. Aqui esta um resumo das suas tarefas.</p>
          </div>

          <Button className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        {!isLoading && !errorMessage && stats.length === 0 ? (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Nenhum indicador disponivel no momento.
          </div>
        ) : (
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
        )}

        <TaskList tasks={recentTasks} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPageView
