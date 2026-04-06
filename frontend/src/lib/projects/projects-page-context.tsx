"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { ProjectCardItem } from "@/lib/projects/types"
import { useProjectsPageController } from "@/lib/projects/useProjectsPageController"

type ProjectsPageContextValue = ReturnType<typeof useProjectsPageController>

const ProjectsPageContext = createContext<ProjectsPageContextValue | null>(null)

interface ProjectsPageProviderProps {
  initialProjects: ProjectCardItem[]
  initialError?: string | null
  children: ReactNode
}

export function ProjectsPageProvider({
  initialProjects,
  initialError = null,
  children,
}: ProjectsPageProviderProps) {
  const value = useProjectsPageController({ initialProjects, initialError })

  return (
    <ProjectsPageContext.Provider value={value}>
      {children}
    </ProjectsPageContext.Provider>
  )
}

export function useProjectsPageContext(): ProjectsPageContextValue {
  const context = useContext(ProjectsPageContext)

  if (!context) {
    throw new Error("useProjectsPageContext must be used within ProjectsPageProvider")
  }

  return context
}
