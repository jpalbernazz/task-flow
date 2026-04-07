import "dotenv/config"
import path from "node:path"
import express from "express"
import cors from "cors"
import authRoutes from "./modules/auth/routes/auth-routes"
import tasksRoutes from "./modules/tasks/routes/tasks-routes"
import projectsRoutes from "./modules/projects/routes/projects-routes"
import usersRoutes from "./modules/users/routes/users-routes"
import { errorHandler } from "./shared/http/error-handler"

const app = express()
const port = Number(process.env.PORT ?? 3001)
const frontendOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "")
const uploadsStaticDir = path.resolve(process.cwd(), "uploads")

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error("origin not allowed by CORS"))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use("/uploads", express.static(uploadsStaticDir))

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use(authRoutes)
app.use(tasksRoutes)
app.use(projectsRoutes)
app.use(usersRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
