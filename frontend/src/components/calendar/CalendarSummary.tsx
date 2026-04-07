"use client";

import {
  AlertTriangle,
  CalendarCheck2,
  CalendarClock,
  CalendarRange,
} from "lucide-react";
import type { ComponentType } from "react";
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  tone?: "default" | "warning" | "danger" | "success";
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="md:text-sm text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div
            className={cn(
              "rounded-md p-1.5",
              tone === "default" && "bg-primary/10 text-primary",
              tone === "success" && "bg-success/10 text-success",
              tone === "warning" && "bg-warning/15 text-warning",
              tone === "danger" && "bg-destructive/10 text-destructive",
            )}
          >
            <Icon className="md:h-5 md:w-5 h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-semibold leading-none text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function CalendarSummary() {
  const { monthSummary } = useCalendarPageContext();

  return (
    <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Tarefas no mês"
        value={monthSummary.tasksInMonth}
        icon={CalendarRange}
      />
      <SummaryCard
        label="Dias com tarefas"
        value={monthSummary.daysWithTasks}
        icon={CalendarCheck2}
        tone="success"
      />
      <SummaryCard
        label="Atrasadas no mês"
        value={monthSummary.overdueTasks}
        icon={AlertTriangle}
        tone="danger"
      />
      <SummaryCard
        label="Próximas no mês"
        value={monthSummary.upcomingTasks}
        icon={CalendarClock}
        tone="warning"
      />
    </div>
  );
}
