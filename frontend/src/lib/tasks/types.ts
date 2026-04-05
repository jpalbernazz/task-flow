export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface TaskApiModel {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
  assigned_user_id: number
  project_id: number
}

export interface TaskViewModel {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignedUserId: number
  projectId: number
}

export interface KanbanColumnData {
  id: TaskStatus
  title: string
  color: string
  tasks: TaskViewModel[]
}
