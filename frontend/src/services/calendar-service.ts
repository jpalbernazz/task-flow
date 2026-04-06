import type { CalendarTask } from "@/lib/calendar/types"
import { getTasks } from "@/services/task-service"

export async function getCalendarTasks(): Promise<CalendarTask[]> {
  return getTasks()
}
