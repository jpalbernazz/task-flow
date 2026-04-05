import type {
  CreateTaskDTO,
  TaskApiModel,
  TaskDTO,
  TaskEntity,
  UpdateTaskDTO,
} from "../types/tasks-types"

export function entityToTaskDTO(entity: TaskEntity): TaskDTO {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    status: entity.status,
    priority: entity.priority,
    dueDate: entity.due_date,
  }
}

export function taskDTOToApiModel(task: TaskDTO): TaskApiModel {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.dueDate,
  }
}

export function createTaskDTOToEntityInput(input: CreateTaskDTO): Omit<TaskEntity, "id"> {
  return {
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    due_date: input.dueDate,
  }
}

export function updateTaskDTOToEntityInput(input: UpdateTaskDTO): Partial<Omit<TaskEntity, "id">> {
  const result: Partial<Omit<TaskEntity, "id">> = {}

  if (input.title !== undefined) {
    result.title = input.title
  }
  if (input.description !== undefined) {
    result.description = input.description
  }
  if (input.status !== undefined) {
    result.status = input.status
  }
  if (input.priority !== undefined) {
    result.priority = input.priority
  }
  if (input.dueDate !== undefined) {
    result.due_date = input.dueDate
  }

  return result
}
