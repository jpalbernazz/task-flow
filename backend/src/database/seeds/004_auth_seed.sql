INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'Admin TaskFlow',
  'admin@taskflow.local',
  '$2b$10$/Oxba7iHx/z5.YytZKIZr.JyhmsyTTApBvmUh2Y7lGd3/9CWTT1l.',
  'user',
  TRUE
)
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW(),
  deleted_at = NULL;
