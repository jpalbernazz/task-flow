ALTER TABLE users
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP NULL;

CREATE TABLE IF NOT EXISTS auth_email_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(32) NOT NULL CHECK (type IN ('verify_email', 'reset_password')),
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT auth_email_tokens_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS auth_email_tokens_user_id_idx
ON auth_email_tokens (user_id);

CREATE INDEX IF NOT EXISTS auth_email_tokens_type_expires_at_idx
ON auth_email_tokens (type, expires_at);

CREATE INDEX IF NOT EXISTS auth_email_tokens_active_idx
ON auth_email_tokens (user_id, type, expires_at)
WHERE used_at IS NULL;
