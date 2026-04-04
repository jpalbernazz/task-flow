"use client"

import { useState } from "react"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import {
  groupTasksByStatus,
  initialKanbanTasks,
  kanbanColumns,
} from "@/services/task-service"
import type { Task, TaskStatus } from "@/types/task"

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialKanbanTasks)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDrop = (nextStatus: TaskStatus) => {
    if (!draggedTask || draggedTask.status === nextStatus) {
      setDraggedTask(null)
      return
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: nextStatus } : task
      )
    )

    setDraggedTask(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {kanbanColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={groupTasksByStatus(tasks, column.id)}
          isDragOver={draggedTask !== null && draggedTask.status !== column.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
