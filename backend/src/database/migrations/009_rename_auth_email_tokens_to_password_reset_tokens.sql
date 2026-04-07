DO $$
BEGIN
  IF to_regclass('public.password_reset_tokens') IS NULL
     AND to_regclass('public.auth_email_tokens') IS NOT NULL THEN
    ALTER TABLE auth_email_tokens RENAME TO password_reset_tokens;
  END IF;
END$$;

DO $$
BEGIN
  IF to_regclass('public.password_reset_tokens') IS NOT NULL
     AND to_regclass('public.auth_email_tokens') IS NOT NULL THEN
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used_at, created_at)
    SELECT user_id, token_hash, expires_at, used_at, created_at
    FROM auth_email_tokens
    ON CONFLICT (token_hash) DO NOTHING;

    DROP TABLE auth_email_tokens;
  END IF;
END$$;

ALTER TABLE IF EXISTS password_reset_tokens
DROP COLUMN IF EXISTS type;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'password_reset_tokens'
      AND c.conname = 'auth_email_tokens_user_id_fkey'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'password_reset_tokens'
      AND c.conname = 'password_reset_tokens_user_id_fkey'
  ) THEN
    ALTER TABLE password_reset_tokens
    RENAME CONSTRAINT auth_email_tokens_user_id_fkey TO password_reset_tokens_user_id_fkey;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'password_reset_tokens'
      AND c.conname = 'auth_email_tokens_token_hash_key'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'password_reset_tokens'
      AND c.conname = 'password_reset_tokens_token_hash_key'
  ) THEN
    ALTER TABLE password_reset_tokens
    RENAME CONSTRAINT auth_email_tokens_token_hash_key TO password_reset_tokens_token_hash_key;
  END IF;
END$$;

DROP INDEX IF EXISTS auth_email_tokens_user_id_idx;
DROP INDEX IF EXISTS auth_email_tokens_type_expires_at_idx;
DROP INDEX IF EXISTS auth_email_tokens_active_idx;
DROP INDEX IF EXISTS password_reset_tokens_user_id_idx;
DROP INDEX IF EXISTS password_reset_tokens_expires_at_idx;
DROP INDEX IF EXISTS password_reset_tokens_active_idx;

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
ON password_reset_tokens (user_id);

CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx
ON password_reset_tokens (expires_at);

CREATE INDEX IF NOT EXISTS password_reset_tokens_active_idx
ON password_reset_tokens (user_id, expires_at)
WHERE used_at IS NULL;
