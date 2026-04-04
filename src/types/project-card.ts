export interface ProjectMember {
  name: string
  avatar: string
}

export interface ProjectCardItem {
  id: string
  name: string
  description: string
  members: ProjectMember[]
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
  status: "planejado" | "em-andamento" | "concluido" | "atrasado"
}
