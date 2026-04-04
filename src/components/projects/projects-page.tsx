"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getProjectCards } from "@/services/project-service"

export function ProjectsPageView() {
  const projects = getProjectCards()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe todos os seus projetos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar projetos..." className="pl-9" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProjectsPageView
