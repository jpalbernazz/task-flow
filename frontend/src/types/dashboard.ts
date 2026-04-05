export type RecentTaskStatus = "todo" | "in-progress" | "completed" | "overdue"
export type RecentTaskPriority = "low" | "medium" | "high"

export interface RecentTaskItem {
  id: string
  title: string
  project: string
  status: RecentTaskStatus
  priority: RecentTaskPriority
  dueDate: string
  assignee: {
    name: string
    avatar?: string
    initials: string
  }
}

export interface DashboardStat {
  title: string
  value: number
  description: string
  icon: "list" | "clock" | "check" | "alert"
  variant: "primary" | "success" | "destructive"
  trend: {
    value: number
    isPositive: boolean
  }
}
