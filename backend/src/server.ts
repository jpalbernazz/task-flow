import "dotenv/config"
import express from "express"
import cors from "cors"
import taskRoutes from "./routes/task-routes"

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use(taskRoutes)

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  res.status(500).json({ error: "internal server error" })
})

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
