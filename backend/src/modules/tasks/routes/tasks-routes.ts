import { Router } from "express"
import { addTask, editTask, listTasks, removeTask } from "../controllers/tasks-controller"

const tasksRoutes = Router()

tasksRoutes.get("/tasks", listTasks)
tasksRoutes.post("/tasks", addTask)
tasksRoutes.put("/tasks/:id", editTask)
tasksRoutes.delete("/tasks/:id", removeTask)

export default tasksRoutes
