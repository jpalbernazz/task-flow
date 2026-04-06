"use client"

import { ProjectCard } from "@/components/projects/ProjectCard"
import { useProjectsPageContext } from "@/lib/projects/projects-page-context"

export function ProjectsGrid() {
  const {
    filteredProjects,
    searchTerm,
  } = useProjectsPageContext()

  if (filteredProjects.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        {searchTerm.trim() === ""
          ? "Nenhum projeto cadastrado no momento."
          : "Nenhum projeto encontrado para este filtro."}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
