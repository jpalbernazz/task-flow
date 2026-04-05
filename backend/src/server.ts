import "dotenv/config"
import express from "express"
import cors from "cors"
import tasksRoutes from "./modules/tasks/routes/tasks-routes"
import { errorHandler } from "./shared/http/error-handler"

const app = express()
const port = Number(process.env.PORT ?? 3001)

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use(tasksRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
