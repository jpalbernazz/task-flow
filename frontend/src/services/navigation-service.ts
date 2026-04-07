import {
  Calendar,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import type { NavigationItem } from "@/lib/navigation/types";

export const mainNavigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projetos", href: "/projects", icon: FolderKanban },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare },
  { label: "Calendário", href: "/calendar", icon: Calendar },
];

export const secondaryNavigationItems: NavigationItem[] = [
  { label: "Configurações", href: "/settings", icon: Settings },
];
