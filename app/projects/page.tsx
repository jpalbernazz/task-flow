"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const projects = [
  {
    id: "1",
    name: "Redesign do Website",
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
    status: "em-andamento" as const,
  },
  {
    id: "2",
    name: "App Mobile",
    description: "Desenvolvimento do aplicativo mobile para iOS e Android com funcionalidades principais.",
    members: [
      { name: "Pedro Costa", avatar: "PC" },
      { name: "Julia Rocha", avatar: "JR" },
    ],
    deadline: "2026-05-20",
    progress: 30,
    tasksCompleted: 8,
    totalTasks: 26,
    status: "em-andamento" as const,
  },
  {
    id: "3",
    name: "Sistema de Pagamentos",
    description: "Integracao com gateways de pagamento e implementacao de checkout seguro.",
    members: [
      { name: "Rafael Mendes", avatar: "RM" },
      { name: "Beatriz Alves", avatar: "BA" },
      { name: "Lucas Ferreira", avatar: "LF" },
      { name: "Camila Dias", avatar: "CD" },
    ],
    deadline: "2026-04-30",
    progress: 85,
    tasksCompleted: 22,
    totalTasks: 26,
    status: "em-andamento" as const,
  },
  {
    id: "4",
    name: "Dashboard Analytics",
    description: "Painel de metricas e relatorios para acompanhamento de KPIs do negocio.",
    members: [
      { name: "Fernando Souza", avatar: "FS" },
      { name: "Patricia Nunes", avatar: "PN" },
    ],
    deadline: "2026-06-10",
    progress: 15,
    tasksCompleted: 4,
    totalTasks: 24,
    status: "planejado" as const,
  },
  {
    id: "5",
    name: "Migracao de Infraestrutura",
    description: "Migrar servidores para cloud e implementar CI/CD automatizado.",
    members: [
      { name: "Gustavo Lima", avatar: "GL" },
    ],
    deadline: "2026-03-28",
    progress: 100,
    tasksCompleted: 15,
    totalTasks: 15,
    status: "concluido" as const,
  },
  {
    id: "6",
    name: "Integracao CRM",
    description: "Conectar sistema interno com plataforma de CRM para gestao de clientes.",
    members: [
      { name: "Amanda Reis", avatar: "AR" },
      { name: "Diego Santos", avatar: "DS" },
      { name: "Larissa Costa", avatar: "LC" },
    ],
    deadline: "2026-04-08",
    progress: 45,
    tasksCompleted: 9,
    totalTasks: 20,
    status: "atrasado" as const,
  },
]

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe todos os seus projetos
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
