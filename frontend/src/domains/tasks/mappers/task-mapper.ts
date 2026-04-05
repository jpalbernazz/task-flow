import type { TaskApiModel, TaskViewModel } from "../types/task-types"

export function taskApiModelToViewModel(task: TaskApiModel): TaskViewModel {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    assignedUserId: task.assigned_user_id,
    projectId: task.project_id,
  }
}
