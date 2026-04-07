import { Router } from "express"
import { requireAuth } from "../../../shared/http/require-auth"
import { addTask, editTask, listTasks, removeTask, reorderTasks } from "../controllers/tasks-controller"

const tasksRoutes = Router()

tasksRoutes.use(requireAuth)
tasksRoutes.get("/tasks", listTasks)
tasksRoutes.post("/tasks", addTask)
tasksRoutes.put("/tasks/reorder", reorderTasks)
tasksRoutes.put("/tasks/:id", editTask)
tasksRoutes.delete("/tasks/:id", removeTask)

export default tasksRoutes
