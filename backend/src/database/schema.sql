-- Legado: mantido para uso manual no DBeaver.
-- Recomendado: usar os scripts versionados em src/database/migrations.

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
