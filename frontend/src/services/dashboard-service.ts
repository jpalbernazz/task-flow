import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"
import { buildDashboardStats, buildRecentTasks, getTodayDateKey } from "@/lib/dashboard/dashboard-utils"
import { getProjectCards } from "@/services/project-service"
import { getTasks } from "@/services/task-service"

interface DashboardData {
  stats: DashboardStat[]
  recentTasks: RecentTaskItem[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const [tasks, projects] = await Promise.all([getTasks(), getProjectCards()])
  const todayDateKey = getTodayDateKey()

  return {
    stats: buildDashboardStats(tasks, projects, todayDateKey),
    recentTasks: buildRecentTasks(tasks, projects, todayDateKey),
  }
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const data = await getDashboardData()
  return data.stats
}

export async function getRecentTasks(): Promise<RecentTaskItem[]> {
  const data = await getDashboardData()
  return data.recentTasks
}
