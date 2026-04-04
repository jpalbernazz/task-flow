import { Router } from "express"
import { addTask, editTask, listTasks, removeTask } from "../controllers/task-controller"

const taskRoutes = Router()

taskRoutes.get("/tasks", listTasks)
taskRoutes.post("/tasks", addTask)
taskRoutes.put("/tasks/:id", editTask)
taskRoutes.delete("/tasks/:id", removeTask)

export default taskRoutes
