import type { ProjectApiModel, ProjectCardItem, ProjectStatus } from "@/lib/projects/types"
import { apiFetch, throwApiError, type ApiRequestContext } from "@/services/api-client"

export type CreateProjectInput = Omit<ProjectCardItem, "id" | "members">
export type UpdateProjectInput = Partial<Omit<ProjectCardItem, "id" | "members">>

const PROJECTS_ENDPOINT = "/projects"

interface ProjectWritePayload {
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

function projectApiModelToViewModel(project: ProjectApiModel): ProjectCardItem {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    deadline: project.deadline,
    progress: project.progress,
    tasksCompleted: project.tasksCompleted,
    totalTasks: project.totalTasks,
    members: [],
  }
}

function toProjectWritePayload(input: CreateProjectInput): ProjectWritePayload {
  return {
    name: input.name,
    description: input.description,
    status: input.status,
    deadline: input.deadline,
    progress: input.progress,
    tasksCompleted: input.tasksCompleted,
    totalTasks: input.totalTasks,
  }
}

function toProjectUpdatePayload(input: UpdateProjectInput): Partial<ProjectWritePayload> {
  const payload: Partial<ProjectWritePayload> = {}

  if (input.name !== undefined) {
    payload.name = input.name
  }
  if (input.description !== undefined) {
    payload.description = input.description
  }
  if (input.status !== undefined) {
    payload.status = input.status
  }
  if (input.deadline !== undefined) {
    payload.deadline = input.deadline
  }
  if (input.progress !== undefined) {
    payload.progress = input.progress
  }
  if (input.tasksCompleted !== undefined) {
    payload.tasksCompleted = input.tasksCompleted
  }
  if (input.totalTasks !== undefined) {
    payload.totalTasks = input.totalTasks
  }

  return payload
}

function buildProjectEndpoint(id?: number): string {
  if (id === undefined) {
    return PROJECTS_ENDPOINT
  }

  return `${PROJECTS_ENDPOINT}/${id}`
}

export async function getProjectCards(context: ApiRequestContext = {}): Promise<ProjectCardItem[]> {
  const response = await apiFetch(buildProjectEndpoint(), {
    cache: "no-store",
    requestHeaders: context.requestHeaders,
  })
  if (!response.ok) {
    await throwApiError(response, "failed to fetch projects")
  }

  const projectApiModels = (await response.json()) as ProjectApiModel[]
  return projectApiModels.map(projectApiModelToViewModel)
}

export async function createProject(input: CreateProjectInput): Promise<ProjectCardItem> {
  const response = await apiFetch(buildProjectEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toProjectWritePayload(input)),
  })
  if (!response.ok) {
    await throwApiError(response, "failed to create project")
  }

  const projectApiModel = (await response.json()) as ProjectApiModel
  return projectApiModelToViewModel(projectApiModel)
}

export async function updateProject(id: number, input: UpdateProjectInput): Promise<ProjectCardItem | null> {
  const response = await apiFetch(buildProjectEndpoint(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toProjectUpdatePayload(input)),
  })

  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    await throwApiError(response, "failed to update project")
  }

  const projectApiModel = (await response.json()) as ProjectApiModel
  return projectApiModelToViewModel(projectApiModel)
}

export async function deleteProject(id: number): Promise<boolean> {
  const response = await apiFetch(buildProjectEndpoint(id), { method: "DELETE" })
  if (response.status === 404) {
    return false
  }
  if (!response.ok) {
    await throwApiError(response, "failed to delete project")
  }

  return true
}
