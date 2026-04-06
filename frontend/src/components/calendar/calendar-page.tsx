"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  buildCalendarDays,
  buildTasksByDateMap,
  formatDateLabel,
  getDateKey,
  getMonthContext,
  getMonthSummary,
  getTasksForDay,
  getTodayDateKey,
  getUpcomingDeadlines,
  MONTHS,
  priorityLabels,
  priorityColors,
  statusColors,
  statusLabels,
  WEEKDAYS,
} from "@/lib/calendar/calendar-utils"
import type { CalendarTask } from "@/lib/calendar/types"
import { getCalendarTasks } from "@/services/calendar-service"

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message
  }

  return fallbackMessage
}

interface SummaryCardProps {
  label: string
  value: number
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function CalendarPageView() {
  const [today] = useState(() => new Date())
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const todayContext = useMemo(
    () => ({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    }),
    [today]
  )

  const todayDateKey = useMemo(() => getTodayDateKey(today), [today])

  const { year, month, startingDayOfWeek, daysInMonth } = getMonthContext(currentDate)

  const loadCalendarTasks = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const tasks = await getCalendarTasks()
      setCalendarTasks(tasks)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel carregar as tarefas do calendario."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCalendarTasks()
  }, [loadCalendarTasks])

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date(todayContext.year, todayContext.month, 1))
    setSelectedDay(todayContext.day)
  }

  const tasksByDate = useMemo(() => buildTasksByDateMap(calendarTasks), [calendarTasks])
  const calendarDays = useMemo(() => buildCalendarDays(startingDayOfWeek, daysInMonth), [startingDayOfWeek, daysInMonth])
  const monthSummary = useMemo(
    () => getMonthSummary(calendarTasks, tasksByDate, year, month, todayDateKey),
    [calendarTasks, tasksByDate, year, month, todayDateKey]
  )
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(calendarTasks, 3), [calendarTasks])
  const selectedDayTasks = useMemo(() => {
    if (selectedDay === null) {
      return []
    }

    return getTasksForDay(tasksByDate, year, month, selectedDay)
  }, [month, selectedDay, tasksByDate, year])

  const selectedDateKey = useMemo(() => {
    if (selectedDay === null) {
      return null
    }

    return getDateKey(year, month, selectedDay)
  }, [month, selectedDay, year])

  const selectedDateLabel = useMemo(() => {
    if (selectedDateKey === null) {
      return null
    }

    return formatDateLabel(selectedDateKey)
  }, [selectedDateKey])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void loadCalendarTasks()} disabled={isLoading}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : null}

        {isLoading ? <p className="text-sm text-muted-foreground">Carregando calendario...</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
            <p className="text-muted-foreground">Visualize suas tarefas e prazos</p>
          </div>
          <Button className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Tarefas no mes" value={monthSummary.tasksInMonth} />
          <SummaryCard label="Dias com tarefas" value={monthSummary.daysWithTasks} />
          <SummaryCard label="Atrasadas no mes" value={monthSummary.overdueTasks} />
          <SummaryCard label="Proximas no mes" value={monthSummary.upcomingTasks} />
        </div>

        {!isLoading && !errorMessage && calendarTasks.length > 0 && monthSummary.tasksInMonth === 0 ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            Nao ha tarefas para {MONTHS[month].toLowerCase()} de {year}. Navegue pelos meses ou clique em Hoje.
          </div>
        ) : null}

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Hoje
              </Button>
            </div>
            <h2 className="text-lg font-semibold">
              {MONTHS[month]} {year}
            </h2>
            <div className="text-sm text-muted-foreground">Calendario</div>
          </div>

          <div className="grid grid-cols-7 border-b bg-muted/50">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const tasks = day !== null ? getTasksForDay(tasksByDate, year, month, day) : []
              const hasTasks = tasks.length > 0
              const taskCount = tasks.length
              const isSelected = day !== null && selectedDay === day
              const isToday =
                day !== null &&
                year === todayContext.year &&
                month === todayContext.month &&
                day === todayContext.day

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-25 border-b border-r p-2 transition-colors last:border-r-0 nth-[7n]:border-r-0",
                    day === null && "bg-muted/30",
                    day !== null && "cursor-pointer hover:bg-accent/50",
                    hasTasks && !isSelected && "bg-primary/10",
                    isToday && "border-primary/50",
                    isSelected && "bg-primary/15 ring-2 ring-primary/50 ring-inset",
                  )}
                  onClick={() => {
                    if (day !== null) {
                      setSelectedDay(day)
                    }
                  }}
                >
                  {day !== null && (
                    <>
                      <div className="mb-1 flex items-center justify-between text-sm font-medium">
                        <span className={cn(isToday && "text-primary")}>{day}</span>
                        {hasTasks ? (
                          <span
                            className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
                            aria-label={`Dia com ${taskCount} tarefas`}
                          >
                            {taskCount > 9 ? "+9" : taskCount}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-1">
                        {tasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="truncate rounded px-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary"
                          >
                            {task.title}
                          </div>
                        ))}
                        {tasks.length > 2 ? (
                          <div className="text-xs text-muted-foreground">+{tasks.length - 2} tarefas</div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-semibold">
            {selectedDateLabel ? `Tarefas em ${selectedDateLabel}` : "Selecione um dia"}
          </h3>

          {selectedDay === null ? (
            <p className="text-sm text-muted-foreground">Clique em um dia do calendario para visualizar as tarefas.</p>
          ) : selectedDayTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nao ha tarefas para {selectedDateLabel}.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedDayTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
                      <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.description.trim() === "" ? "Sem descricao." : task.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Prazo: {formatDateLabel(task.dueDate)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Proximos Prazos</h3>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nao ha prazos futuros cadastrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingDeadlines.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDateLabel(task.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
                    <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !errorMessage && calendarTasks.length === 0 ? (
          <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            Nenhuma tarefa encontrada. Crie tarefas com data para visualizar no calendario.
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}

export default CalendarPageView
