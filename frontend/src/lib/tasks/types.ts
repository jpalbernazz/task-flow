export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"
export type TaskModalMode = "create" | "edit"

export interface TaskViewModel {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
  position: number
}

export interface KanbanColumnData {
  id: TaskStatus
  title: string
  color: string
  tasks: TaskViewModel[]
}

export interface TaskReorderColumnInput {
  status: TaskStatus
  taskIds: number[]
}

export interface ReorderTasksInput {
  columns: TaskReorderColumnInput[]
}
