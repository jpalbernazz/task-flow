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
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
