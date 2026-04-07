import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types"
import { buildDashboardStats, buildRecentTasks, getTodayDateKey } from "@/lib/dashboard/dashboard-utils"
import { getTasks } from "@/services/task-service"
import type { ApiRequestContext } from "@/services/api-client"

interface DashboardData {
  stats: DashboardStat[]
  recentTasks: RecentTaskItem[]
}

export async function getDashboardData(context: ApiRequestContext = {}): Promise<DashboardData> {
  const tasks = await getTasks(context)
  const todayDateKey = getTodayDateKey()

  return {
    stats: buildDashboardStats(tasks, todayDateKey),
    recentTasks: buildRecentTasks(tasks, todayDateKey),
  }
}

export async function getDashboardStats(context: ApiRequestContext = {}): Promise<DashboardStat[]> {
  const data = await getDashboardData(context)
  return data.stats
}

export async function getRecentTasks(context: ApiRequestContext = {}): Promise<RecentTaskItem[]> {
  const data = await getDashboardData(context)
  return data.recentTasks
}
