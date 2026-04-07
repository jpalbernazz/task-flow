"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useProjectsPageContext } from "@/lib/projects/projects-page-context"

export function ProjectsPageFeedback() {
  const { errorMessage, infoMessage, refreshProjects } = useProjectsPageContext()
  const lastErrorRef = useRef<string | null>(null)
  const lastInfoRef = useRef<string | null>(null)

  useEffect(() => {
    if (!errorMessage) {
      lastErrorRef.current = null
      return
    }

    if (lastErrorRef.current === errorMessage) {
      return
    }

    lastErrorRef.current = errorMessage
    toast.error(errorMessage, {
      action: {
        label: "Tentar novamente",
        onClick: () => void refreshProjects(),
      },
    })
  }, [errorMessage, refreshProjects])

  useEffect(() => {
    if (!infoMessage) {
      lastInfoRef.current = null
      return
    }

    if (lastInfoRef.current === infoMessage) {
      return
    }

    lastInfoRef.current = infoMessage
    toast.success(infoMessage)
  }, [infoMessage])

  return null
}
