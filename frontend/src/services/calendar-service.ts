import type { CalendarTask } from "@/lib/calendar/types"
import { getTasks } from "@/services/task-service"
import type { ApiRequestContext } from "@/services/api-client"

export async function getCalendarTasks(context: ApiRequestContext = {}): Promise<CalendarTask[]> {
  return getTasks(context)
}
