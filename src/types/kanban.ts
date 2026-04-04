import type { TaskStatus, Task } from "@/types"

export interface KanbanColumnData {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}
