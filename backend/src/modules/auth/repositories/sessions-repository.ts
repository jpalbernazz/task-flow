import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { SessionWithUserEntity } from "../types/auth-types"

interface InsertSessionInput {
  userId: number
  sessionTokenHash: string
  expiresAt: Date
}

export async function insertSession(input: InsertSessionInput): Promise<void> {
  await pool.query(
    `
      INSERT INTO sessions (user_id, session_token_hash, expires_at)
      VALUES ($1, $2, $3)
    `,
    [input.userId, input.sessionTokenHash, input.expiresAt]
  )
}

export async function findActiveSessionWithUserByTokenHash(
  sessionTokenHash: string,
): Promise<SessionWithUserEntity | null> {
  const result: QueryResult<SessionWithUserEntity> = await pool.query(
    `
      SELECT
        s.id AS session_id,
        s.user_id AS session_user_id,
        s.expires_at AS session_expires_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.password_hash AS user_password_hash,
        u.avatar_url AS user_avatar_url,
        u.avatar_storage_key AS user_avatar_storage_key,
        u.role AS user_role,
        u.is_active AS user_is_active
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.session_token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > NOW()
        AND u.deleted_at IS NULL
      LIMIT 1
    `,
    [sessionTokenHash]
  )

  return result.rows[0] ?? null
}

export async function revokeSessionByTokenHash(sessionTokenHash: string): Promise<void> {
  await pool.query(
    `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE session_token_hash = $1
        AND revoked_at IS NULL
    `,
    [sessionTokenHash]
  )
}

export async function revokeActiveSessionsByUserId(userId: number): Promise<void> {
  await pool.query(
    `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
    `,
    [userId],
  )
}

export async function revokeOtherActiveSessionsByUserId(
  userId: number,
  currentSessionId: number,
): Promise<void> {
  await pool.query(
    `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = $1
        AND id <> $2
        AND revoked_at IS NULL
        AND expires_at > NOW()
    `,
    [userId, currentSessionId],
  )
}
