import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { ProjectEntity } from "../types/projects-types"

export async function findAllProjects(): Promise<ProjectEntity[]> {
  const result: QueryResult<ProjectEntity> = await pool.query(
    `
      SELECT id, name, description, status, deadline, progress, tasks_completed, total_tasks
      FROM projects
      WHERE deleted_at IS NULL
      ORDER BY id ASC
    `
  )

  return result.rows
}

export async function findProjectById(id: number): Promise<ProjectEntity | null> {
  const result: QueryResult<ProjectEntity> = await pool.query(
    `
      SELECT id, name, description, status, deadline, progress, tasks_completed, total_tasks
      FROM projects
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function insertProject(input: Omit<ProjectEntity, "id">): Promise<ProjectEntity> {
  const result: QueryResult<ProjectEntity> = await pool.query(
    `
      INSERT INTO projects (name, description, status, deadline, progress, tasks_completed, total_tasks)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, description, status, deadline, progress, tasks_completed, total_tasks
    `,
    [
      input.name,
      input.description,
      input.status,
      input.deadline,
      input.progress,
      input.tasks_completed,
      input.total_tasks,
    ]
  )

  return result.rows[0]
}

export async function updateProject(id: number, input: Omit<ProjectEntity, "id">): Promise<ProjectEntity | null> {
  const result: QueryResult<ProjectEntity> = await pool.query(
    `
      UPDATE projects
      SET name = $1,
          description = $2,
          status = $3,
          deadline = $4,
          progress = $5,
          tasks_completed = $6,
          total_tasks = $7,
          updated_at = NOW()
      WHERE id = $8
        AND deleted_at IS NULL
      RETURNING id, name, description, status, deadline, progress, tasks_completed, total_tasks
    `,
    [
      input.name,
      input.description,
      input.status,
      input.deadline,
      input.progress,
      input.tasks_completed,
      input.total_tasks,
      id,
    ]
  )

  return result.rows[0] ?? null
}

export async function deleteProject(id: number): Promise<boolean> {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const softDeleteResult = await client.query(
      `
        UPDATE projects
        SET deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
          AND deleted_at IS NULL
        RETURNING id
      `,
      [id]
    )

    if (softDeleteResult.rowCount !== 1) {
      await client.query("ROLLBACK")
      return false
    }

    await client.query(
      `
        UPDATE tasks
        SET project_id = NULL,
            updated_at = NOW()
        WHERE project_id = $1
          AND deleted_at IS NULL
      `,
      [id]
    )

    await client.query("COMMIT")
    return true
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
