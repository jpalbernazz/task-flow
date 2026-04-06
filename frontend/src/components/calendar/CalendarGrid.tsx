"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  getTasksForDay,
  MONTHS,
  WEEKDAYS,
} from "@/lib/calendar/calendar-utils"
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context"
import { cn } from "@/lib/utils"

export function CalendarGrid() {
  const {
    year,
    month,
    todayContext,
    calendarTasks,
    selectedDay,
    setSelectedDay,
    tasksByDate,
    calendarDays,
    monthSummary,
    prevMonth,
    nextMonth,
    goToToday,
    viewState,
  } = useCalendarPageContext()

  return (
    <>
      {!viewState.isRefreshing && !viewState.hasError && calendarTasks.length > 0 && monthSummary.tasksInMonth === 0 ? (
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
    </>
  )
}
