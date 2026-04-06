import { AppError } from "../../../shared/http/app-error"
import { findProjectById } from "../../projects/repositories/projects-repository"
import {
  createTaskDTOToEntityInput,
  entityToTaskDTO,
  updateTaskDTOToEntityInput,
} from "../mappers/tasks-mapper"
import { deleteTask, findAllTasks, findTaskById, insertTask, updateTask } from "../repositories/tasks-repository"
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../types/tasks-types"

async function ensureProjectExists(projectId: number | null | undefined): Promise<void> {
  if (projectId === undefined || projectId === null) {
    return
  }

  const project = await findProjectById(projectId)
  if (!project) {
    throw new AppError(400, "projectId references a project that does not exist")
  }
}

export async function getTasks(): Promise<TaskDTO[]> {
  const tasks = await findAllTasks()
  return tasks.map(entityToTaskDTO)
}

export async function createTask(input: CreateTaskDTO): Promise<TaskDTO> {
  await ensureProjectExists(input.projectId)
  const createdTask = await insertTask(createTaskDTOToEntityInput(input))
  return entityToTaskDTO(createdTask)
}

export async function editTaskById(id: number, input: UpdateTaskDTO): Promise<TaskDTO> {
  const currentTask = await findTaskById(id)
  if (!currentTask) {
    throw new AppError(404, "task not found")
  }
  await ensureProjectExists(input.projectId)

  const mergedTask = {
    ...currentTask,
    ...updateTaskDTOToEntityInput(input),
  }

  const updatedTask = await updateTask(id, mergedTask)
  if (!updatedTask) {
    throw new AppError(404, "task not found")
  }

  return entityToTaskDTO(updatedTask)
}

export async function removeTaskById(id: number): Promise<void> {
  const deleted = await deleteTask(id)
  if (!deleted) {
    throw new AppError(404, "task not found")
  }
}
