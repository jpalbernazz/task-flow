"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { CalendarTask } from "@/lib/calendar/types"
import { useCalendarPageController } from "@/lib/calendar/useCalendarPageController"

type CalendarPageContextValue = ReturnType<typeof useCalendarPageController>

const CalendarPageContext = createContext<CalendarPageContextValue | null>(null)

interface CalendarPageProviderProps {
  initialTasks: CalendarTask[]
  initialError?: string | null
  children: ReactNode
}

export function CalendarPageProvider({
  initialTasks,
  initialError = null,
  children,
}: CalendarPageProviderProps) {
  const value = useCalendarPageController({ initialTasks, initialError })

  return (
    <CalendarPageContext.Provider value={value}>
      {children}
    </CalendarPageContext.Provider>
  )
}

export function useCalendarPageContext(): CalendarPageContextValue {
  const context = useContext(CalendarPageContext)

  if (!context) {
    throw new Error("useCalendarPageContext must be used within CalendarPageProvider")
  }

  return context
}
