import type { ProjectStatus } from "@/lib/projects/types"

export const projectStatusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
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
