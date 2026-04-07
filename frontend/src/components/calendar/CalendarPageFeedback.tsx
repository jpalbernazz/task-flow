"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"

export function CalendarPageFeedback() {
  const { errorMessage, infoMessage, refreshCalendarTasks } = useCalendarPageContext()
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
        onClick: () => void refreshCalendarTasks(),
      },
    })
  }, [errorMessage, refreshCalendarTasks])

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
