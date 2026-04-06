ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS project_id INTEGER NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tasks_project_id_fkey'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects (id)
    ON DELETE SET NULL;
  END IF;
END$$;
