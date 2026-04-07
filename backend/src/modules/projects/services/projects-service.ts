import { AppError } from "../../../shared/http/app-error"
import {
  createProjectDTOToEntityInput,
  entityToProjectDTO,
  updateProjectDTOToEntityInput,
} from "../mappers/projects-mapper"
import {
  deleteProject,
  findAllProjects,
  findProjectById,
  insertProject,
  syncAllProjectMetrics,
  updateProject,
} from "../repositories/projects-repository"
import type { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from "../types/projects-types"

export async function getProjects(): Promise<ProjectDTO[]> {
  await syncAllProjectMetrics()
  const projects = await findAllProjects()
  return projects.map(entityToProjectDTO)
}

export async function createProject(input: CreateProjectDTO): Promise<ProjectDTO> {
  const createdProject = await insertProject(createProjectDTOToEntityInput(input))
  return entityToProjectDTO(createdProject)
}

export async function editProjectById(id: number, input: UpdateProjectDTO): Promise<ProjectDTO> {
  const currentProject = await findProjectById(id)
  if (!currentProject) {
    throw new AppError(404, "project not found")
  }

  const mergedProject = {
    ...currentProject,
    ...updateProjectDTOToEntityInput(input),
  }

  const updatedProject = await updateProject(id, mergedProject)
  if (!updatedProject) {
    throw new AppError(404, "project not found")
  }

  return entityToProjectDTO(updatedProject)
}

export async function removeProjectById(id: number): Promise<void> {
  const deleted = await deleteProject(id)
  if (!deleted) {
    throw new AppError(404, "project not found")
  }
}
