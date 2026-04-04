export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

export interface Project {
  id: number
  name: string
  description: string
  ownerUserId: number
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignedUserId: number
  projectId: number
}
