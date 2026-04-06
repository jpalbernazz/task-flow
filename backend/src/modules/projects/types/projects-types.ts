export type ProjectStatus = "planejado" | "em-andamento" | "concluido" | "atrasado"

export interface ProjectEntity {
  id: number
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasks_completed: number
  total_tasks: number
}

export interface ProjectDTO {
  id: number
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

export interface CreateProjectDTO {
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

export interface UpdateProjectDTO {
  name?: string
  description?: string
  status?: ProjectStatus
  deadline?: string
  progress?: number
  tasksCompleted?: number
  totalTasks?: number
}
