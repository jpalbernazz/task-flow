import { Pool } from "pg"

const host = process.env.PGHOST ?? "localhost"
const isLocalDatabase = host === "localhost" || host === "127.0.0.1"

const pool = new Pool({
  host,
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "task_flow",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres",
  ssl: isLocalDatabase ? undefined : { rejectUnauthorized: false },
})

export default pool
