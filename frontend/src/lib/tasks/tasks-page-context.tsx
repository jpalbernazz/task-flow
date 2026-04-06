"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { TaskViewModel } from "@/lib/tasks/types"
import { useTasksPageController } from "@/lib/tasks/useTasksPageController"

type TasksPageContextValue = ReturnType<typeof useTasksPageController>

const TasksPageContext = createContext<TasksPageContextValue | null>(null)

interface TasksPageProviderProps {
  initialTasks: TaskViewModel[]
  initialError?: string | null
  children: ReactNode
}

export function TasksPageProvider({
  initialTasks,
  initialError = null,
  children,
}: TasksPageProviderProps) {
  const value = useTasksPageController({ initialTasks, initialError })

  return (
    <TasksPageContext.Provider value={value}>
      {children}
    </TasksPageContext.Provider>
  )
}

export function useTasksPageContext(): TasksPageContextValue {
  const context = useContext(TasksPageContext)

  if (!context) {
    throw new Error("useTasksPageContext must be used within TasksPageProvider")
  }

  return context
}
