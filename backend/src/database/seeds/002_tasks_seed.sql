TRUNCATE TABLE tasks RESTART IDENTITY;

INSERT INTO tasks (title, description, status, priority, due_date, project_id)
VALUES
  ('Planejar sprint', 'Definir backlog da próxima sprint', 'todo', 'high', CURRENT_DATE + INTERVAL '2 days', NULL),
  ('Refatorar service', 'Melhorar legibilidade do task-service', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '5 days', NULL),
  ('Revisar PR', 'Revisar alterações pendentes no GitHub', 'done', 'low', CURRENT_DATE - INTERVAL '1 day', NULL);
