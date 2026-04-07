"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"

export function TasksPageFeedback() {
  const { errorMessage, infoMessage, refreshData, viewState } = useTasksPageContext()
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
        onClick: () => void refreshData(),
      },
    })
  }, [errorMessage, refreshData])

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
        loadingToastIdRef.current = toast.loading("Atualizando tarefas...")
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
