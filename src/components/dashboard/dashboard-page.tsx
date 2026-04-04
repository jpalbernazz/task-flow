import { AlertTriangle, CheckCircle2, Clock, ListTodo, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TaskList } from "@/components/dashboard/task-list"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getRecentTasks } from "@/services/dashboard-service"

const iconMap = {
  list: ListTodo,
  clock: Clock,
  check: CheckCircle2,
  alert: AlertTriangle,
}

export function DashboardPageView() {
  const stats = getDashboardStats()
  const recentTasks = getRecentTasks()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Painel</h1>
            <p className="text-muted-foreground">Bem-vindo de volta. Aqui esta um resumo das suas tarefas.</p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <TaskList tasks={recentTasks} />
      </div>
    </DashboardLayout>
  )
}

export default DashboardPageView
