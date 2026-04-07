import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"
import { buildDashboardStats, buildRecentTasks, getTodayDateKey } from "@/lib/dashboard/dashboard-utils"
import { getTasks } from "@/services/task-service"

interface DashboardData {
  stats: DashboardStat[]
  recentTasks: RecentTaskItem[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const tasks = await getTasks()
  const todayDateKey = getTodayDateKey()

  return {
    stats: buildDashboardStats(tasks, todayDateKey),
    recentTasks: buildRecentTasks(tasks, todayDateKey),
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
