"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"
import { useDashboardPageController } from "@/lib/dashboard/useDashboardPageController"

type DashboardPageContextValue = ReturnType<typeof useDashboardPageController>

const DashboardPageContext = createContext<DashboardPageContextValue | null>(null)

interface DashboardPageProviderProps {
  initialStats: DashboardStat[]
  initialRecentTasks: RecentTaskItem[]
  initialError?: string | null
  children: ReactNode
}

export function DashboardPageProvider({
  initialStats,
  initialRecentTasks,
  initialError = null,
  children,
}: DashboardPageProviderProps) {
  const value = useDashboardPageController({
    initialStats,
    initialRecentTasks,
    initialError,
  })

  return (
    <DashboardPageContext.Provider value={value}>
      {children}
    </DashboardPageContext.Provider>
  )
}

export function useDashboardPageContext(): DashboardPageContextValue {
  const context = useContext(DashboardPageContext)

  if (!context) {
    throw new Error("useDashboardPageContext must be used within DashboardPageProvider")
  }

  return context
}
