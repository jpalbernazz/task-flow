import { AppError } from "../../../shared/http/app-error"
import { findProjectById } from "../../projects/repositories/projects-repository"
import {
  createTaskDTOToEntityInput,
  entityToTaskDTO,
  updateTaskDTOToEntityInput,
} from "../mappers/tasks-mapper"
import {
  bulkReorderTasks,
  deleteTask,
  findAllTasks,
  findTaskById,
  getNextPositionForStatus,
  insertTask,
  updateTask,
} from "../repositories/tasks-repository"
import type {
  CreateTaskDTO,
  TaskDTO,
  TaskReorderDTO,
  UpdateTaskDTO,
} from "../types/tasks-types"

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
  const entityInput = createTaskDTOToEntityInput(input)
  entityInput.position = await getNextPositionForStatus(entityInput.status)
  const createdTask = await insertTask(entityInput)
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

  if (input.status !== undefined && input.status !== currentTask.status) {
    mergedTask.position = await getNextPositionForStatus(input.status)
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

export async function reorderTasksBoard(input: TaskReorderDTO): Promise<void> {
  const currentTasks = await findAllTasks()
  const currentTaskIds = new Set(currentTasks.map((task) => task.id))

  const orderedTaskIds = input.columns.flatMap((column) => column.taskIds)
  if (orderedTaskIds.length !== currentTaskIds.size) {
    throw new AppError(400, "reorder payload must include all active tasks")
  }

  for (const taskId of orderedTaskIds) {
    if (!currentTaskIds.has(taskId)) {
      throw new AppError(400, "reorder payload contains unknown task ids")
    }
  }

  const updates = input.columns.flatMap((column) =>
    column.taskIds.map((taskId, position) => ({
      id: taskId,
      status: column.status,
      position,
    }))
  )

  await bulkReorderTasks(updates)
}
