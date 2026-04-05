import type { Request, Response } from "express"
import { taskDTOToApiModel } from "../mappers/task-mapper"
import { createTask, editTaskById, getTasks, removeTaskById } from "../services/task-service"
import { parseTaskId, validateCreateTaskPayload, validateUpdateTaskPayload } from "../validators/task-validator"

export async function listTasks(_req: Request, res: Response) {
  const tasks = await getTasks()
  return res.status(200).json(tasks.map(taskDTOToApiModel))
}

export async function addTask(req: Request, res: Response) {
  const input = validateCreateTaskPayload(req.body)
  const task = await createTask(input)

  return res.status(201).json(taskDTOToApiModel(task))
}

export async function editTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id)
  const input = validateUpdateTaskPayload(req.body)
  const task = await editTaskById(id, input)

  return res.status(200).json(taskDTOToApiModel(task))
}

export async function removeTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id)
  await removeTaskById(id)

  return res.status(204).send()
}
