"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useDashboardPageContext } from "@/lib/dashboard/dashboard-page-context"

export function DashboardPageFeedback() {
  const { errorMessage, infoMessage, refreshDashboard } = useDashboardPageContext()
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
        onClick: () => void refreshDashboard(),
      },
    })
  }, [errorMessage, refreshDashboard])

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
