import type { Request, Response } from "express"
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  type TaskPriority,
  type TaskStatus,
  updateTaskById,
} from "../services/task-service"

const validStatus: TaskStatus[] = ["todo", "in_progress", "done"]
const validPriority: TaskPriority[] = ["low", "medium", "high"]

function hasValidStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && validStatus.includes(value as TaskStatus)
}

function hasValidPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && validPriority.includes(value as TaskPriority)
}

function hasValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

export async function listTasks(_req: Request, res: Response) {
  const tasks = await getAllTasks()
  return res.status(200).json(tasks)
}

export async function addTask(req: Request, res: Response) {
  const { title, description, status, priority, due_date } = req.body

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" })
  }

  if (typeof description !== "string") {
    return res.status(400).json({ error: "description is required" })
  }

  if (!hasValidStatus(status)) {
    return res.status(400).json({ error: "status must be todo, in_progress or done" })
  }

  if (!hasValidPriority(priority)) {
    return res.status(400).json({ error: "priority must be low, medium or high" })
  }

  if (!hasValidDate(due_date)) {
    return res.status(400).json({ error: "due_date must be a valid date string" })
  }

  const task = await createTask({
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    due_date,
  })

  return res.status(201).json(task)
}

export async function editTask(req: Request, res: Response) {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" })
  }

  const { title, description, status, priority, due_date } = req.body

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "title must be a non-empty string" })
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "description must be a string" })
  }

  if (status !== undefined && !hasValidStatus(status)) {
    return res.status(400).json({ error: "status must be todo, in_progress or done" })
  }

  if (priority !== undefined && !hasValidPriority(priority)) {
    return res.status(400).json({ error: "priority must be low, medium or high" })
  }

  if (due_date !== undefined && !hasValidDate(due_date)) {
    return res.status(400).json({ error: "due_date must be a valid date string" })
  }

  const task = await updateTaskById(id, {
    title: title?.trim(),
    description: description?.trim(),
    status,
    priority,
    due_date,
  })

  if (!task) {
    return res.status(404).json({ error: "task not found" })
  }

  return res.status(200).json(task)
}

export async function removeTask(req: Request, res: Response) {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" })
  }

  const deleted = await deleteTaskById(id)

  if (!deleted) {
    return res.status(404).json({ error: "task not found" })
  }

  return res.status(204).send()
}
