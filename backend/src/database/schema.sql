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
