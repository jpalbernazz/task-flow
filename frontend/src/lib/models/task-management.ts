import type { TaskPriority, TaskStatus } from "@/lib/tasks/types"

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
