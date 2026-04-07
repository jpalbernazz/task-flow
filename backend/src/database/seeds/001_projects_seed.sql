TRUNCATE TABLE projects RESTART IDENTITY CASCADE;

INSERT INTO projects (name, description, status, deadline, progress, tasks_completed, total_tasks)
VALUES
  ('Redesign do Site', 'Modernizar o site institucional com nova identidade visual e melhor experiência do usuário.', 'em-andamento', CURRENT_DATE + INTERVAL '10 days', 65, 18, 28),
  ('Aplicativo Mobile', 'Desenvolvimento do aplicativo mobile para iOS e Android com funcionalidades principais.', 'planejado', CURRENT_DATE + INTERVAL '45 days', 30, 8, 26);
