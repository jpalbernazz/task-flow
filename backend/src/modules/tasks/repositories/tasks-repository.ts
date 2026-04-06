import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { TaskEntity } from "../types/tasks-types"

export async function findAllTasks(): Promise<TaskEntity[]> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date, project_id
      FROM tasks
      WHERE deleted_at IS NULL
      ORDER BY id ASC
    `
  )

  return result.rows
}

export async function findTaskById(id: number): Promise<TaskEntity | null> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date, project_id
      FROM tasks
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function insertTask(input: Omit<TaskEntity, "id">): Promise<TaskEntity> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      INSERT INTO tasks (title, description, status, priority, due_date, project_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, status, priority, due_date, project_id
    `,
    [input.title, input.description, input.status, input.priority, input.due_date, input.project_id]
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
          due_date = $5,
          project_id = $6,
          updated_at = NOW()
      WHERE id = $7
        AND deleted_at IS NULL
      RETURNING id, title, description, status, priority, due_date, project_id
    `,
    [input.title, input.description, input.status, input.priority, input.due_date, input.project_id, id]
  )

  return result.rows[0] ?? null
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await pool.query(
    `
      UPDATE tasks
      SET deleted_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [id]
  )

  return result.rowCount === 1
}
