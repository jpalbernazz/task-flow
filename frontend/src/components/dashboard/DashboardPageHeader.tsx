"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardPageHeader() {
  return (
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
  )
}
