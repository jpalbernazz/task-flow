import { AppError } from "../../../shared/http/app-error"
import {
  createTaskDTOToEntityInput,
  entityToTaskDTO,
  updateTaskDTOToEntityInput,
} from "../mappers/task-mapper"
import { deleteTask, findAllTasks, findTaskById, insertTask, updateTask } from "../repositories/task-repository"
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../types/task-types"

export async function getTasks(): Promise<TaskDTO[]> {
  const tasks = await findAllTasks()
  return tasks.map(entityToTaskDTO)
}

export async function createTask(input: CreateTaskDTO): Promise<TaskDTO> {
  const createdTask = await insertTask(createTaskDTOToEntityInput(input))
  return entityToTaskDTO(createdTask)
}

export async function editTaskById(id: number, input: UpdateTaskDTO): Promise<TaskDTO> {
  const currentTask = await findTaskById(id)
  if (!currentTask) {
    throw new AppError(404, "task not found")
  }

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
