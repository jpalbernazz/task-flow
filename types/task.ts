export type TaskStatus = "todo" | "in-progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface TaskAssignee {
  name: string
  avatar: string
}

export interface Task {
  id: string
  title: string
  assignee: TaskAssignee
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
}

export interface KanbanColumnConfig {
  id: TaskStatus
  title: string
  color: string
}
