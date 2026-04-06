import type { Request, Response } from "express"
import { createProject, editProjectById, getProjects, removeProjectById } from "../services/projects-service"
import {
  parseProjectId,
  validateCreateProjectPayload,
  validateUpdateProjectPayload,
} from "../validators/projects-validator"

export async function listProjects(_req: Request, res: Response) {
  const projects = await getProjects()
  return res.status(200).json(projects)
}

export async function addProject(req: Request, res: Response) {
  const input = validateCreateProjectPayload(req.body)
  const project = await createProject(input)

  return res.status(201).json(project)
}

export async function editProject(req: Request, res: Response) {
  const id = parseProjectId(req.params.id)
  const input = validateUpdateProjectPayload(req.body)
  const project = await editProjectById(id, input)

  return res.status(200).json(project)
}

export async function removeProject(req: Request, res: Response) {
  const id = parseProjectId(req.params.id)
  await removeProjectById(id)

  return res.status(204).send()
}
