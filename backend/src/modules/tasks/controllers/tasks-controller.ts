import type { Request, Response } from "express"
import {
  createTask,
  editTaskById,
  getTasks,
  removeTaskById,
  reorderTasksBoard,
} from "../services/tasks-service"
import {
  parseTaskId,
  validateCreateTaskPayload,
  validateReorderTasksPayload,
  validateUpdateTaskPayload,
} from "../validators/tasks-validator"

export async function listTasks(_req: Request, res: Response) {
  const tasks = await getTasks()
  return res.status(200).json(tasks)
}

export async function addTask(req: Request, res: Response) {
  const input = validateCreateTaskPayload(req.body)
  const task = await createTask(input)

  return res.status(201).json(task)
}

export async function editTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id)
  const input = validateUpdateTaskPayload(req.body)
  const task = await editTaskById(id, input)

  return res.status(200).json(task)
}

export async function removeTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id)
  await removeTaskById(id)

  return res.status(204).send()
}

export async function reorderTasks(req: Request, res: Response) {
  const input = validateReorderTasksPayload(req.body)
  await reorderTasksBoard(input)

  return res.status(204).send()
}
