import type { QueryResult } from "pg"
import pool from "../database"

export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
}

export async function getAllTasks(): Promise<Task[]> {
  const result: QueryResult<Task> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date
      FROM tasks
      ORDER BY id ASC
    `
  )

  return result.rows
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const result: QueryResult<Task> = await pool.query(
    `
      INSERT INTO tasks (title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, status, priority, due_date
    `,
    [input.title, input.description, input.status, input.priority, input.due_date]
  )

  return result.rows[0]
}

export async function updateTaskById(id: number, input: UpdateTaskInput): Promise<Task | null> {
  const currentResult: QueryResult<Task> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date
      FROM tasks
      WHERE id = $1
    `,
    [id]
  )

  const currentTask = currentResult.rows[0]
  if (!currentTask) return null

  const nextTask: Task = {
    ...currentTask,
    ...input,
  }

  const result: QueryResult<Task> = await pool.query(
    `
      UPDATE tasks
      SET title = $1,
          description = $2,
          status = $3,
          priority = $4,
          due_date = $5
      WHERE id = $6
      RETURNING id, title, description, status, priority, due_date
    `,
    [
      nextTask.title,
      nextTask.description,
      nextTask.status,
      nextTask.priority,
      nextTask.due_date,
      id,
    ]
  )

  return result.rows[0] ?? null
}

export async function deleteTaskById(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id])
  return result.rowCount === 1
}
