import { Filter, LayoutGrid, List, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { getKanbanColumns } from "../services/task-service"
import { KanbanBoard } from "./kanban-board"

export function TasksPageView() {
  const columns = getKanbanColumns()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tarefas</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas tarefas com o quadro Kanban</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-1">
              <Button variant="ghost" size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary/20">
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Visualizacao Kanban</span>
              </Button>

              <Button variant="ghost" size="sm" className="h-8">
                <List className="h-4 w-4" />
                <span className="sr-only">Visualizacao Lista</span>
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>

            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <KanbanBoard columns={columns} />
      </div>
    </DashboardLayout>
  )
}

export default TasksPageView
