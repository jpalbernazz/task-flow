export interface CalendarTask {
  id: string
  title: string
  date: string
  priority: "alta" | "media" | "baixa"
  type: "prazo" | "tarefa"
}
