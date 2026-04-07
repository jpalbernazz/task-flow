"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useProjectsPageContext } from "@/lib/projects/projects-page-context"

export function ProjectsPageFeedback() {
  const { errorMessage, infoMessage, refreshProjects, viewState } = useProjectsPageContext()
  const lastErrorRef = useRef<string | null>(null)
  const lastInfoRef = useRef<string | null>(null)
  const loadingToastIdRef = useRef<string | number | null>(null)
  const firstRefreshStartedRef = useRef(false)
  const firstRefreshHandledRef = useRef(false)

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

  useEffect(() => {
    if (!firstRefreshHandledRef.current) {
      if (viewState.isRefreshing) {
        firstRefreshStartedRef.current = true
      } else if (firstRefreshStartedRef.current) {
        firstRefreshHandledRef.current = true
      }
      return
    }

    if (viewState.isRefreshing) {
      if (!loadingToastIdRef.current) {
        loadingToastIdRef.current = toast.loading("Atualizando projetos...")
      }
      return
    }

    if (loadingToastIdRef.current) {
      toast.dismiss(loadingToastIdRef.current)
      loadingToastIdRef.current = null
    }
  }, [viewState.isRefreshing])

  useEffect(() => {
    return () => {
      if (loadingToastIdRef.current) {
        toast.dismiss(loadingToastIdRef.current)
      }
    }
  }, [])

  return null
}
