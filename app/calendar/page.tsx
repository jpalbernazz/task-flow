"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarTask {
  id: string
  title: string
  date: string
  priority: "alta" | "media" | "baixa"
  type: "prazo" | "tarefa"
}

const sampleTasks: CalendarTask[] = [
  { id: "1", title: "Entregar relatorio", date: "2026-04-03", priority: "alta", type: "prazo" },
  { id: "2", title: "Reuniao de equipe", date: "2026-04-05", priority: "media", type: "tarefa" },
  { id: "3", title: "Revisar codigo", date: "2026-04-08", priority: "baixa", type: "tarefa" },
  { id: "4", title: "Prazo do projeto", date: "2026-04-10", priority: "alta", type: "prazo" },
]

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))

  useEffect(() => {
    setMounted(true)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const formatDateKey = (day: number): string => {
    const m = String(month + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${year}-${m}-${d}`
  }

  const getTasksForDate = (day: number): CalendarTask[] => {
    const dateKey = formatDateKey(day)
    return sampleTasks.filter((task) => task.date === dateKey)
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(null)
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day)
  while (calendarDays.length < 42) calendarDays.push(null)

  const priorityColors = {
    alta: "bg-destructive text-destructive-foreground",
    media: "bg-warning text-warning-foreground",
    baixa: "bg-muted text-muted-foreground",
  }

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-muted" />
          <div className="h-[600px] rounded bg-muted" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
            <p className="text-muted-foreground">Visualize suas tarefas e prazos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
            <div className="text-sm text-muted-foreground">Calendario</div>
          </div>

          <div className="grid grid-cols-7 border-b bg-muted/50">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 py-3 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const tasks = day ? getTasksForDate(day) : []
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] border-b border-r p-2 transition-colors last:border-r-0 [&:nth-child(7n)]:border-r-0",
                    day === null && "bg-muted/30",
                    day !== null && "cursor-pointer hover:bg-accent/50"
                  )}
                >
                  {day !== null && (
                    <>
                      <div className="mb-1 text-sm font-medium">{day}</div>
                      <div className="flex flex-col gap-1">
                        {tasks.slice(0, 2).map((task) => (
                          <div key={task.id} className="truncate rounded px-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary">
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Proximos Prazos</h3>
          <div className="flex flex-col gap-3">
            {sampleTasks
              .filter((task) => task.type === "prazo")
              .slice(0, 3)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{task.title}</span>
                  <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
