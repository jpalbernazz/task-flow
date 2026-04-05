import {
  Calendar,
  CheckSquare,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Settings,
} from "lucide-react"
import type { NavigationItem } from "@/lib/navigation/types"

export const mainNavigationItems: NavigationItem[] = [
  { label: "Painel", href: "/", icon: LayoutDashboard },
  { label: "Projetos", href: "/projects", icon: FolderKanban },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare },
  { label: "Calendario", href: "/calendar", icon: Calendar },
]

export const secondaryNavigationItems: NavigationItem[] = [
  { label: "Configuracoes", href: "/configuracoes", icon: Settings },
  { label: "Ajuda", href: "/ajuda", icon: HelpCircle },
]
