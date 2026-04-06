ALTER TABLE projects
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS projects_deleted_at_idx
ON projects (deleted_at);

CREATE INDEX IF NOT EXISTS tasks_deleted_at_idx
ON tasks (deleted_at);

CREATE INDEX IF NOT EXISTS tasks_active_project_id_idx
ON tasks (project_id)
WHERE deleted_at IS NULL;
