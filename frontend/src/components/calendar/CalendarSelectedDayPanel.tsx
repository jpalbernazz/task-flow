"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateLabel,
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from "@/lib/calendar/calendar-utils";
import { useCalendarPageContext } from "@/lib/calendar/calendar-page-context";

export function CalendarSelectedDayPanel() {
  const { selectedDay, selectedDayTasks, selectedDateLabel } =
    useCalendarPageContext();

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground">
        {selectedDateLabel
          ? `Tarefas em ${selectedDateLabel}`
          : "Selecione um dia"}
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        {selectedDayTasks.length > 0
          ? `${selectedDayTasks.length} tarefa${selectedDayTasks.length > 1 ? "s" : ""} planejada${selectedDayTasks.length > 1 ? "s" : ""}`
          : "Visualize o detalhamento do dia selecionado"}
      </p>

      {selectedDay === null ? (
        <p className="text-sm text-muted-foreground">
          Clique em um dia do calendário para visualizar as tarefas.
        </p>
      ) : selectedDayTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Não há tarefas para {selectedDateLabel}.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {selectedDayTasks.map((task) => (
            <article
              key={task.id}
              className="rounded-xl border border-border/80 bg-background/30 p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {task.title}
                </span>

                <Button variant="outline" size="xs" asChild>
                  <Link href={`/tasks?edit=${task.id}`}>Editar</Link>
                </Button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {task.description.trim() === ""
                  ? "Sem descrição."
                  : task.description}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[task.priority]}>
                    {priorityLabels[task.priority]}
                  </Badge>
                  <Badge className={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prazo: {formatDateLabel(task.dueDate)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
