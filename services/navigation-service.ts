import {
  Calendar,
  CheckSquare,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  Settings,
} from "lucide-react"
import type { NavigationItem } from "@/types/navigation"

export const mainNavigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Projetos", href: "/projects", icon: FolderKanban },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare },
  { label: "Calendario", href: "/calendar", icon: Calendar },
]

export const secondaryNavigationItems: NavigationItem[] = [
  { label: "Configuracoes", href: "/settings", icon: Settings },
  { label: "Ajuda", href: "/help", icon: HelpCircle },
]
