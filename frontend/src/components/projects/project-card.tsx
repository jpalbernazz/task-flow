"use client"

import type { ProjectCardItem } from "@/lib/projects/types"
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

interface ProjectCardProps {
  project: ProjectCardItem
  onEditProject?: (project: ProjectCardItem) => Promise<void> | void
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
  const hasDateOnlyFormat = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const normalizedDate = hasDateOnlyFormat ? `${date}T00:00:00Z` : date
  const parsedDate = new Date(normalizedDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate)
}

export function ProjectCard({ project, onEditProject }: ProjectCardProps) {
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
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  void onEditProject?.(project)
                }}
              >
                Editar projeto
              </DropdownMenuItem>
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
