"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarTask {
  id: string;
  title: string;
  date: string;
  priority: "alta" | "media" | "baixa";
  type: "deadline" | "task";
}

const sampleTasks: CalendarTask[] = [
  {
    id: "1",
    title: "Entregar relatorio",
    date: "2026-04-03",
    priority: "alta",
    type: "deadline",
  },
  {
    id: "2",
    title: "Reuniao de equipe",
    date: "2026-04-05",
    priority: "media",
    type: "task",
  },
  {
    id: "3",
    title: "Revisar codigo",
    date: "2026-04-08",
    priority: "baixa",
    type: "task",
  },
  {
    id: "4",
    title: "Prazo do projeto",
    date: "2026-04-10",
    priority: "alta",
    type: "deadline",
  },
  {
    id: "5",
    title: "Design review",
    date: "2026-04-12",
    priority: "media",
    type: "task",
  },
  {
    id: "6",
    title: "Sprint planning",
    date: "2026-04-15",
    priority: "media",
    type: "task",
  },
  {
    id: "7",
    title: "Entrega final",
    date: "2026-04-20",
    priority: "alta",
    type: "deadline",
  },
  {
    id: "8",
    title: "Testes de integracao",
    date: "2026-04-18",
    priority: "media",
    type: "task",
  },
  {
    id: "9",
    title: "Documentacao",
    date: "2026-04-22",
    priority: "baixa",
    type: "task",
  },
  {
    id: "10",
    title: "Lancamento beta",
    date: "2026-04-25",
    priority: "alta",
    type: "deadline",
  },
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 3, 1));
  };

  const formatDateKey = (day: number): string => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const getTasksForDate = (day: number): CalendarTask[] => {
    const dateKey = formatDateKey(day);
    return sampleTasks.filter((task) => task.date === dateKey);
  };

  const isToday = (day: number): boolean => {
    const today = new Date(2026, 3, 3);
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const remainingCells = 42 - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push(null);
  }

  const priorityColors = {
    alta: "bg-destructive text-destructive-foreground",
    media: "bg-warning text-warning-foreground",
    baixa: "bg-muted text-muted-foreground",
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-6" />
          <div className="h-[600px] bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

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
              <Button variant="ghost" onClick={goToToday} className="ml-2">
                Hoje
              </Button>
            </div>
            <h2 className="text-lg font-semibold">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                Prazo
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Tarefa
              </div>
            </div>
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
              const tasks = day ? getTasksForDate(day) : [];
              const hasDeadline = tasks.some((t) => t.type === "deadline");

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] border-b border-r p-2 transition-colors last:border-r-0 [&:nth-child(7n)]:border-r-0",
                    day === null && "bg-muted/30",
                    day !== null && "hover:bg-accent/50 cursor-pointer",
                  )}
                >
                  {day !== null && (
                    <>
                      <div
                        className={cn(
                          "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                          isToday(day) && "bg-primary text-primary-foreground",
                          hasDeadline &&
                            !isToday(day) &&
                            "text-destructive font-bold",
                        )}
                      >
                        {day}
                      </div>
                      <div className="flex flex-col gap-1">
                        {tasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "truncate rounded px-1.5 py-0.5 text-xs font-medium",
                              task.type === "deadline"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-primary/15 text-primary",
                            )}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {tasks.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{tasks.length - 3} mais
                          </span>
                        )}
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
            {sampleTasks
              .filter((t) => t.type === "deadline")
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map((task) => {
                const [y, m, d] = task.date.split("-");
                const dateStr = `${parseInt(d)} de ${MONTHS[parseInt(m) - 1]}`;
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
