TRUNCATE TABLE tasks RESTART IDENTITY;

INSERT INTO tasks (title, description, status, priority, due_date)
VALUES
  ('Planejar sprint', 'Definir backlog da proxima sprint', 'todo', 'high', CURRENT_DATE + INTERVAL '2 days'),
  ('Refatorar service', 'Melhorar legibilidade do task-service', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '5 days'),
  ('Revisar PR', 'Revisar alteracoes pendentes no GitHub', 'done', 'low', CURRENT_DATE - INTERVAL '1 day');
