import type { Project } from "@/lib/models/task-management"

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Redesign do Site",
    description: "Atualizacao visual e melhoria de UX do site principal.",
    ownerUserId: 1,
  },
  {
    id: 2,
    name: "Aplicativo Mobile",
    description: "Desenvolvimento do app mobile para clientes internos.",
    ownerUserId: 2,
  },
  {
    id: 3,
    name: "Integracoes de API",
    description: "Integracao com servicos externos e padronizacao de webhooks.",
    ownerUserId: 3,
  },
]
