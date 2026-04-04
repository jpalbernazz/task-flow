import { Plus, AlertTriangle, CheckCircle2, Clock, ListTodo } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TaskList } from "@/components/dashboard/task-list"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Aqui esta um resumo das suas tarefas.
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Tarefas"
            value={42}
            description="Todas as tarefas ativas"
            icon={ListTodo}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Em Progresso"
            value={18}
            description="Tarefas em andamento"
            icon={Clock}
            variant="primary"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Concluidas"
            value={156}
            description="Este mes"
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 24, isPositive: true }}
          />
          <StatsCard
            title="Atrasadas"
            value={3}
            description="Requerem atencao"
            icon={AlertTriangle}
            variant="destructive"
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        <TaskList />
      </div>
    </DashboardLayout>
  )
}
