export interface ProjectMember {
  name: string
  avatar: string
}

export type ProjectStatus = "planejado" | "em-andamento" | "concluido" | "atrasado"

export interface ProjectApiModel {
  id: number
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

export interface ProjectCardItem {
  id: number
  name: string
  description: string
  members: ProjectMember[]
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
  status: ProjectStatus
}
