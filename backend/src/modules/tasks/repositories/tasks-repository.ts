import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { TaskEntity } from "../types/tasks-types"

export async function findAllTasks(): Promise<TaskEntity[]> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date
      FROM tasks
      ORDER BY id ASC
    `
  )

  return result.rows
}

export async function findTaskById(id: number): Promise<TaskEntity | null> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date
      FROM tasks
      WHERE id = $1
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function insertTask(input: Omit<TaskEntity, "id">): Promise<TaskEntity> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      INSERT INTO tasks (title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, status, priority, due_date
    `,
    [input.title, input.description, input.status, input.priority, input.due_date]
  )

  return result.rows[0]
}

export async function updateTask(id: number, input: Omit<TaskEntity, "id">): Promise<TaskEntity | null> {
  const result: QueryResult<TaskEntity> = await pool.query(
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
    [input.title, input.description, input.status, input.priority, input.due_date, id]
  )

  return result.rows[0] ?? null
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id])
  return result.rowCount === 1
}
