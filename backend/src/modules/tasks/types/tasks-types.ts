export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface TaskEntity {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

export interface TaskDTO {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

export interface TaskApiModel {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

export interface CreateTaskDTO {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export interface CreateTaskApiInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

export interface UpdateTaskApiInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
}
