import { Router } from "express"
import { addProject, editProject, listProjects, removeProject } from "../controllers/projects-controller"

const projectsRoutes = Router()

projectsRoutes.get("/projects", listProjects)
projectsRoutes.post("/projects", addProject)
projectsRoutes.put("/projects/:id", editProject)
projectsRoutes.delete("/projects/:id", removeProject)

export default projectsRoutes
