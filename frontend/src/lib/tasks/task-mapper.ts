import type { TaskApiModel, TaskViewModel } from "./types"

export function taskApiModelToViewModel(task: TaskApiModel): TaskViewModel {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
  }
}
