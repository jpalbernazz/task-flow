"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildCalendarDays,
  getMonthContext,
  getTasksForDay,
  getUpcomingDeadlines,
  MONTHS,
  priorityColors,
  WEEKDAYS,
} from "@/lib/calendar/calendar-utils";
import { getCalendarTasks } from "@/services/calendar-service";

export function CalendarPageView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const calendarTasks = getCalendarTasks();

  const { year, month, startingDayOfWeek, daysInMonth } =
    getMonthContext(currentDate);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays = buildCalendarDays(startingDayOfWeek, daysInMonth);
  const upcomingDeadlines = getUpcomingDeadlines(calendarTasks, 3);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
            <p className="text-muted-foreground">
              Visualize suas tarefas e prazos
            </p>
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
              const tasks = day
                ? getTasksForDay(calendarTasks, year, month, day)
                : [];
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-25 border-b border-r p-2 transition-colors last:border-r-0 nth-[7n]:border-r-0",
                    day === null && "bg-muted/30",
                    day !== null && "cursor-pointer hover:bg-accent/50",
                  )}
                >
                  {day !== null && (
                    <>
                      <div className="mb-1 text-sm font-medium">{day}</div>
                      <div className="flex flex-col gap-1">
                        {tasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="truncate rounded px-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary"
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Proximos Prazos</h3>
          <div className="flex flex-col gap-3">
            {upcomingDeadlines.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="font-medium">{task.title}</span>
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CalendarPageView;
