"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Member {
  name: string
  avatar: string
}

interface ProjectCardData {
  id: string
  name: string
  description: string
  members: Member[]
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
  status: "planejado" | "em-andamento" | "concluido" | "atrasado"
}

interface ProjectCardProps {
  project: ProjectCardData
}

const statusConfig = {
  planejado: {
    label: "Planejado",
    className: "bg-secondary text-secondary-foreground",
  },
  "em-andamento": {
    label: "Em Andamento",
    className: "bg-primary/10 text-primary",
  },
  concluido: {
    label: "Concluido",
    className: "bg-success/10 text-success",
  },
  atrasado: {
    label: "Atrasado",
    className: "bg-destructive/10 text-destructive",
  },
}

function formatDate(date: string): string {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
  const parts = date.split("-")
  if (parts.length !== 3) return date

  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const day = parseInt(parts[2], 10)

  return `${day} de ${months[month - 1]} de ${year}`
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status]
  const maxVisibleMembers = 3
  const extraMembers = project.members.length - maxVisibleMembers

  return (
    <Card className="group transition-all hover:border-primary/20 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className={cn("font-medium", status.className)}>
            {status.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Opcoes do projeto</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem>Editar projeto</DropdownMenuItem>
              <DropdownMenuItem>Gerenciar equipe</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Excluir projeto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 pt-2">
          <h3 className="leading-tight font-semibold text-foreground">{project.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {project.tasksCompleted}/{project.totalTasks} tarefas
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex -space-x-2">
            {project.members.slice(0, maxVisibleMembers).map((member, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-card">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">{member.avatar}</AvatarFallback>
              </Avatar>
            ))}

            {extraMembers > 0 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
                +{extraMembers}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            Ver projeto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
