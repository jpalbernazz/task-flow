"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal"
import { Button } from "@/components/ui/Button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { useProjectsPageController } from "@/lib/projects/useProjectsPageController"

export function ProjectsPageView() {
  const {
    searchTerm,
    setSearchTerm,
    filteredProjects,
    errorMessage,
    infoMessage,
    isRefreshing,
    refreshProjects,
    isModalOpen,
    modalMode,
    modalIntent,
    selectedProject,
    handleModalOpenChange,
    handleOpenCreateModal,
    handleOpenProjectModal,
    handleCreateProject,
    handleUpdateProject,
  } = useProjectsPageController()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void refreshProjects()} disabled={isRefreshing}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
            {infoMessage}
          </div>
        ) : null}

        {isRefreshing ? <p className="text-sm text-muted-foreground">Atualizando projetos...</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe todos os seus projetos</p>
          </div>
          <Button className="gap-2" onClick={handleOpenCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              className="pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {searchTerm.trim() === ""
              ? "Nenhum projeto cadastrado no momento."
              : "Nenhum projeto encontrado para este filtro."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenProject={handleOpenProjectModal}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailsModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        mode={modalMode}
        initialIntent={modalIntent}
        project={selectedProject}
        onCreate={handleCreateProject}
        onUpdate={handleUpdateProject}
      />
    </DashboardLayout>
  )
}

export default ProjectsPageView
