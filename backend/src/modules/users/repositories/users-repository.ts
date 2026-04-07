import type { QueryResult } from "pg"
import pool from "../../../database/connection"
import type { CreateUserDTO, UserEntity } from "../types/users-types"

const userSelectColumns = `
  id,
  name,
  email,
  password_hash,
  avatar_url,
  avatar_storage_key,
  role,
  is_active,
  last_login_at
`

export async function findUserByEmail(email: string): Promise<UserEntity | null> {
  const result: QueryResult<UserEntity> = await pool.query(
    `
      SELECT ${userSelectColumns}
      FROM users
      WHERE email = $1
        AND deleted_at IS NULL
      LIMIT 1
    `,
    [email]
  )

  return result.rows[0] ?? null
}

export async function findUserById(id: number): Promise<UserEntity | null> {
  const result: QueryResult<UserEntity> = await pool.query(
    `
      SELECT ${userSelectColumns}
      FROM users
      WHERE id = $1
        AND deleted_at IS NULL
      LIMIT 1
    `,
    [id]
  )

  return result.rows[0] ?? null
}

export async function insertUser(input: CreateUserDTO): Promise<UserEntity> {
  const result: QueryResult<UserEntity> = await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, 'user', TRUE)
      RETURNING ${userSelectColumns}
    `,
    [input.name, input.email, input.passwordHash]
  )

  return result.rows[0]
}

export async function touchLastLoginAt(userId: number): Promise<void> {
  await pool.query(
    `
      UPDATE users
      SET last_login_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
        AND deleted_at IS NULL
    `,
    [userId]
  )
}

export async function updateUserPasswordHash(userId: number, passwordHash: string): Promise<void> {
  await pool.query(
    `
      UPDATE users
      SET password_hash = $1,
          updated_at = NOW()
      WHERE id = $2
        AND deleted_at IS NULL
    `,
    [passwordHash, userId],
  )
}

export async function updateUserName(userId: number, name: string): Promise<UserEntity | null> {
  const result: QueryResult<UserEntity> = await pool.query(
    `
      UPDATE users
      SET name = $1,
          updated_at = NOW()
      WHERE id = $2
        AND deleted_at IS NULL
      RETURNING ${userSelectColumns}
    `,
    [name, userId]
  )

  return result.rows[0] ?? null
}

export async function updateUserAvatar(
  userId: number,
  avatarUrl: string,
  avatarStorageKey: string,
): Promise<UserEntity | null> {
  const result: QueryResult<UserEntity> = await pool.query(
    `
      UPDATE users
      SET avatar_url = $1,
          avatar_storage_key = $2,
          updated_at = NOW()
      WHERE id = $3
        AND deleted_at IS NULL
      RETURNING ${userSelectColumns}
    `,
    [avatarUrl, avatarStorageKey, userId]
  )

  return result.rows[0] ?? null
}
