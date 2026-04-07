import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { TaskEntity, TaskStatus } from "../types/tasks-types"

interface TaskReorderUpdate {
  id: number
  status: TaskStatus
  position: number
}

export async function findAllTasks(): Promise<TaskEntity[]> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date, project_id, position
      FROM tasks
      WHERE deleted_at IS NULL
      ORDER BY
        CASE status
          WHEN 'todo' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'done' THEN 3
          ELSE 4
        END ASC,
        position ASC,
        id ASC
    `
  )

  return result.rows
}

export async function findTaskById(id: number): Promise<TaskEntity | null> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      SELECT id, title, description, status, priority, due_date, project_id, position
      FROM tasks
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function getNextPositionForStatus(status: TaskStatus): Promise<number> {
  const result = await pool.query<{ next_position: number }>(
    `
      SELECT COALESCE(MAX(position), -1) + 1 AS next_position
      FROM tasks
      WHERE status = $1
        AND deleted_at IS NULL
    `,
    [status]
  )

  return result.rows[0]?.next_position ?? 0
}

export async function insertTask(input: Omit<TaskEntity, "id">): Promise<TaskEntity> {
  const result: QueryResult<TaskEntity> = await pool.query(
    `
      INSERT INTO tasks (title, description, status, priority, due_date, project_id, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, status, priority, due_date, project_id, position
    `,
    [
      input.title,
      input.description,
      input.status,
      input.priority,
      input.due_date,
      input.project_id,
      input.position,
    ]
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
          position = $7,
          updated_at = NOW()
      WHERE id = $8
        AND deleted_at IS NULL
      RETURNING id, title, description, status, priority, due_date, project_id, position
    `,
    [
      input.title,
      input.description,
      input.status,
      input.priority,
      input.due_date,
      input.project_id,
      input.position,
      id,
    ]
  )

  return result.rows[0] ?? null
}

export async function bulkReorderTasks(updates: TaskReorderUpdate[]): Promise<void> {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    for (const item of updates) {
      await client.query(
        `
          UPDATE tasks
          SET status = $1,
              position = $2,
              updated_at = NOW()
          WHERE id = $3
            AND deleted_at IS NULL
        `,
        [item.status, item.position, item.id]
      )
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
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
