-- Legado: mantido para uso manual no DBeaver.
-- Recomendado: usar os scripts versionados em src/database/migrations.

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE NOT NULL,
  project_id INTEGER NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('planejado', 'em-andamento', 'concluido', 'atrasado')),
  deadline DATE NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  tasks_completed INTEGER NOT NULL CHECK (tasks_completed >= 0),
  total_tasks INTEGER NOT NULL CHECK (total_tasks >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT NULL,
  avatar_storage_key TEXT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  session_token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT sessions_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT password_reset_tokens_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_project_id_fkey;

ALTER TABLE tasks
ADD CONSTRAINT tasks_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects (id)
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS projects_deleted_at_idx
ON projects (deleted_at);

CREATE INDEX IF NOT EXISTS tasks_deleted_at_idx
ON tasks (deleted_at);

CREATE INDEX IF NOT EXISTS tasks_active_project_id_idx
ON tasks (project_id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS tasks_active_status_position_idx
ON tasks (status, position, id)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS users_deleted_at_idx
ON users (deleted_at);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx
ON sessions (user_id);

CREATE INDEX IF NOT EXISTS sessions_active_idx
ON sessions (user_id, expires_at)
WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
ON password_reset_tokens (user_id);

CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx
ON password_reset_tokens (expires_at);

CREATE INDEX IF NOT EXISTS password_reset_tokens_active_idx
ON password_reset_tokens (user_id, expires_at)
WHERE used_at IS NULL;
