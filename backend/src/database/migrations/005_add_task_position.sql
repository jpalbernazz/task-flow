ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS position INTEGER;

WITH ranked_tasks AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY status
      ORDER BY created_at ASC, id ASC
    ) - 1 AS ranked_position
  FROM tasks
  WHERE deleted_at IS NULL
)
UPDATE tasks AS target
SET position = ranked_tasks.ranked_position
FROM ranked_tasks
WHERE target.id = ranked_tasks.id
  AND target.position IS NULL;

UPDATE tasks
SET position = 0
WHERE position IS NULL;

ALTER TABLE tasks
ALTER COLUMN position SET DEFAULT 0;

ALTER TABLE tasks
ALTER COLUMN position SET NOT NULL;

CREATE INDEX IF NOT EXISTS tasks_active_status_position_idx
ON tasks (status, position, id)
WHERE deleted_at IS NULL;
