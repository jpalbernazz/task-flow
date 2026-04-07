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
        <div className="flex flex-col gap-6 lg:gap-8">
          <CalendarPageFeedback />
          <CalendarPageHeader />
          <CalendarSummary />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="flex min-w-0 flex-col gap-4">
              <CalendarGrid />
              <CalendarEmptyState />
            </div>

            <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
              <CalendarSelectedDayPanel />
              <CalendarUpcomingDeadlines />
            </aside>
          </div>
        </div>
      </DashboardLayout>
    </CalendarPageProvider>
  )
}
