import type { CalendarTask } from "@/lib/calendar/types"

const calendarTasks: CalendarTask[] = [
  { id: "1", title: "Entregar relatorio", date: "2026-04-03", priority: "alta", type: "prazo" },
  { id: "2", title: "Reuniao de equipe", date: "2026-04-05", priority: "media", type: "tarefa" },
  { id: "3", title: "Revisar codigo", date: "2026-04-08", priority: "baixa", type: "tarefa" },
  { id: "4", title: "Prazo do projeto", date: "2026-04-10", priority: "alta", type: "prazo" },
]

export function getCalendarTasks(): CalendarTask[] {
  return calendarTasks
}
