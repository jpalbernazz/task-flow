export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface TaskEntity {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
  project_id: number | null
}

export interface TaskDTO {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
}

export interface CreateTaskDTO {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId?: number | null
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  projectId?: number | null
}
