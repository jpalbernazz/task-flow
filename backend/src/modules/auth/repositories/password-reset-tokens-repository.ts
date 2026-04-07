import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { PasswordResetTokenEntity } from "../types/auth-types"

interface InsertPasswordResetTokenInput {
  userId: number
  tokenHash: string
  expiresAt: Date
}

export async function invalidateActiveResetTokensByUserId(userId: number): Promise<void> {
  await pool.query(
    `
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE user_id = $1
        AND used_at IS NULL
        AND expires_at > NOW()
    `,
    [userId],
  )
}

export async function insertResetToken(input: InsertPasswordResetTokenInput): Promise<void> {
  await pool.query(
    `
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
    `,
    [input.userId, input.tokenHash, input.expiresAt],
  )
}

export async function consumeActiveResetTokenByHash(tokenHash: string): Promise<PasswordResetTokenEntity | null> {
  const result: QueryResult<PasswordResetTokenEntity> = await pool.query(
    `
      WITH target AS (
        SELECT id
        FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
      )
      UPDATE password_reset_tokens t
      SET used_at = NOW()
      FROM target
      WHERE t.id = target.id
      RETURNING t.id, t.user_id, t.token_hash, t.expires_at, t.used_at
    `,
    [tokenHash],
  )

  return result.rows[0] ?? null
}
