import "dotenv/config"
import fs from "node:fs/promises"
import path from "node:path"
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

async function resolveSqlFiles(inputPath) {
  const absolutePath = path.resolve(process.cwd(), inputPath)
  const stats = await fs.stat(absolutePath)

  if (stats.isFile()) {
    return [absolutePath]
  }

  const entries = await fs.readdir(absolutePath)
  return entries
    .filter((entry) => entry.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b))
    .map((entry) => path.join(absolutePath, entry))
}

async function run() {
  const inputPath = process.argv[2]

  if (!inputPath) {
    console.error("Use: node scripts/run-sql.mjs <arquivo-ou-pasta-sql>")
    process.exit(1)
  }

  const sqlFiles = await resolveSqlFiles(inputPath)

  if (sqlFiles.length === 0) {
    console.log("Nenhum arquivo .sql encontrado")
    return
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    for (const file of sqlFiles) {
      const sql = await fs.readFile(file, "utf-8")
      if (!sql.trim()) continue
      await client.query(sql)
      console.log(`OK: ${path.basename(file)}`)
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((error) => {
  console.error("Erro ao executar scripts SQL:", error)
  process.exit(1)
})
