"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTasksForDay, WEEKDAYS } from "@/lib/calendar/calendar-utils";
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context";
import { cn } from "@/lib/utils";

function focusDayButton(day: number) {
  requestAnimationFrame(() => {
    const nextDayButton = document.querySelector<HTMLButtonElement>(
      `[data-calendar-day="${day}"]`,
    );
    nextDayButton?.focus();
  });
}

export function CalendarGrid() {
  const {
    year,
    month,
    monthLabel,
    todayContext,
    selectedDay,
    selectDay,
    handleDayKeyDown,
    tasksByDate,
    calendarDays,
    monthSummary,
    prevMonth,
    nextMonth,
    goToToday,
    refreshCalendarTasks,
    isRefreshing,
    viewState,
    calendarUiState,
  } = useCalendarPageContext();

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center md:gap-5 gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {monthLabel}
              </h2>
              <p className="text-xs text-muted-foreground">
                {monthSummary.tasksInMonth} tarefas distribuídas em{" "}
                {monthSummary.daysWithTasks} dias
              </p>
            </div>
          </div>

          {calendarUiState.isMonthEmpty ? (
            <div className="rounded-md border border-warning/30 bg-warning/10 p-2 text-xs text-warning md:max-w-sm md:flex-1 md:self-stretch md:flex md:items-center">
              <p>Este mês não possui tarefas programadas.</p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={prevMonth}
              aria-label="Mês anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={nextMonth}
              aria-label="Próximo mês"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refreshCalendarTasks()}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b bg-muted/35">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2.5 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase md:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7"
          role="grid"
          aria-label={`Calendário de ${monthLabel}`}
        >
          {calendarDays.map((day, index) => {
            const tasks =
              day !== null ? getTasksForDay(tasksByDate, year, month, day) : [];
            const hasTasks = tasks.length > 0;
            const taskCount = tasks.length;
            const isSelected = day !== null && selectedDay === day;
            const dayColumn = index % 7;
            const isWeekend = dayColumn === 0 || dayColumn === 6;
            const isToday =
              day !== null &&
              year === todayContext.year &&
              month === todayContext.month &&
              day === todayContext.day;

            return (
              <div
                key={index}
                role={day !== null ? "gridcell" : undefined}
                aria-selected={day !== null ? isSelected : undefined}
                className={cn(
                  "min-h-28 border-b border-r p-1.5 last:border-r-0 nth-[7n]:border-r-0 md:p-2",
                  day === null && "bg-muted/20",
                  day !== null && isWeekend && "bg-muted/15",
                  day !== null && hasTasks && !isSelected && "bg-primary/5",
                  day !== null &&
                    isSelected &&
                    "bg-primary/10 ring-1 ring-primary/30 ring-inset",
                )}
              >
                {day !== null && (
                  <button
                    type="button"
                    data-calendar-day={day}
                    onClick={() => selectDay(day)}
                    onKeyDown={(event) => {
                      const nextDay = handleDayKeyDown(event, day);
                      if (nextDay !== null && nextDay !== day) {
                        focusDayButton(nextDay);
                      }
                    }}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`Dia ${day}${hasTasks ? ` com ${taskCount} tarefas` : " sem tarefas"}`}
                    className={cn(
                      "h-full w-full rounded-md p-1.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      "hover:bg-accent/50",
                    )}
                  >
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span
                        className={cn(
                          isToday && "text-primary",
                          isSelected && "font-semibold",
                        )}
                      >
                        {day}
                      </span>
                      {hasTasks ? (
                        <span
                          className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground"
                          aria-label={`Dia com ${taskCount} tarefas`}
                        >
                          {taskCount > 9 ? "+9" : taskCount}
                        </span>
                      ) : null}
                    </div>
                    <div className="lg:flex flex-col gap-1 hidden mt-1">
                      {tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="truncate rounded px-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary"
                        >
                          {task.title}
                        </div>
                      ))}
                      {tasks.length > 2 ? (
                        <div className="text-xs text-muted-foreground">
                          +{tasks.length - 2} tarefas
                        </div>
                      ) : null}
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {viewState.isRefreshing ? (
          <div className="border-t bg-muted/15 px-4 py-2 text-xs text-muted-foreground">
            Atualizando tarefas do calendário...
          </div>
        ) : null}
      </div>
    </>
  );
}
