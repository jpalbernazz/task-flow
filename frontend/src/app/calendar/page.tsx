import { CalendarEmptyState } from "@/components/calendar/CalendarEmptyState"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { CalendarPageFeedback } from "@/components/calendar/CalendarPageFeedback"
import { CalendarPageHeader } from "@/components/calendar/CalendarPageHeader"
import { CalendarSelectedDayPanel } from "@/components/calendar/CalendarSelectedDayPanel"
import { CalendarSummary } from "@/components/calendar/CalendarSummary"
import { CalendarUpcomingDeadlines } from "@/components/calendar/CalendarUpcomingDeadlines"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { CalendarPageProvider } from "@/lib/calendar/calendar-page-context"
import type { CalendarTask } from "@/lib/calendar/types"
import { getCalendarTasks } from "@/services/calendar-service"

export default async function CalendarPage() {
  let initialTasks: CalendarTask[] = []
  let initialError: string | null = null

  try {
    initialTasks = await getCalendarTasks()
  } catch {
    initialError = "Não foi possível carregar as tarefas do calendário na inicialização."
  }

  return (
    <CalendarPageProvider initialTasks={initialTasks} initialError={initialError}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <CalendarPageFeedback />
          <CalendarPageHeader />
          <CalendarSummary />
          <CalendarGrid />
          <CalendarSelectedDayPanel />
          <CalendarUpcomingDeadlines />
          <CalendarEmptyState />
        </div>
      </DashboardLayout>
    </CalendarPageProvider>
  )
}
