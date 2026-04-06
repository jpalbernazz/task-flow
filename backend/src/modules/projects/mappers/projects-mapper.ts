import type {
  CreateProjectDTO,
  ProjectDTO,
  ProjectEntity,
  UpdateProjectDTO,
} from "../types/projects-types"

export function entityToProjectDTO(entity: ProjectEntity): ProjectDTO {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    status: entity.status,
    deadline: entity.deadline,
    progress: entity.progress,
    tasksCompleted: entity.tasks_completed,
    totalTasks: entity.total_tasks,
  }
}

export function createProjectDTOToEntityInput(input: CreateProjectDTO): Omit<ProjectEntity, "id"> {
  return {
    name: input.name,
    description: input.description,
    status: input.status,
    deadline: input.deadline,
    progress: input.progress,
    tasks_completed: input.tasksCompleted,
    total_tasks: input.totalTasks,
  }
}

export function updateProjectDTOToEntityInput(input: UpdateProjectDTO): Partial<Omit<ProjectEntity, "id">> {
  const result: Partial<Omit<ProjectEntity, "id">> = {}

  if (input.name !== undefined) {
    result.name = input.name
  }
  if (input.description !== undefined) {
    result.description = input.description
  }
  if (input.status !== undefined) {
    result.status = input.status
  }
  if (input.deadline !== undefined) {
    result.deadline = input.deadline
  }
  if (input.progress !== undefined) {
    result.progress = input.progress
  }
  if (input.tasksCompleted !== undefined) {
    result.tasks_completed = input.tasksCompleted
  }
  if (input.totalTasks !== undefined) {
    result.total_tasks = input.totalTasks
  }

  return result
}
