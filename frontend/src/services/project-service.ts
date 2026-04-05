import type { ProjectCardItem } from "@/types"

const projects: ProjectCardItem[] = [
  {
    id: "1",
    name: "Redesign do Site",
    description: "Modernizar o site institucional com nova identidade visual e melhor experiencia do usuario.",
    members: [
      { name: "Ana Silva", avatar: "AS" },
      { name: "Carlos Lima", avatar: "CL" },
      { name: "Maria Santos", avatar: "MS" },
    ],
    deadline: "2026-04-15",
    progress: 65,
    tasksCompleted: 18,
    totalTasks: 28,
    status: "em-andamento",
  },
  {
    id: "2",
    name: "Aplicativo Mobile",
    description: "Desenvolvimento do aplicativo mobile para iOS e Android com funcionalidades principais.",
    members: [
      { name: "Pedro Costa", avatar: "PC" },
      { name: "Julia Rocha", avatar: "JR" },
    ],
    deadline: "2026-05-20",
    progress: 30,
    tasksCompleted: 8,
    totalTasks: 26,
    status: "em-andamento",
  },
]

export function getProjectCards(): ProjectCardItem[] {
  return projects
}
