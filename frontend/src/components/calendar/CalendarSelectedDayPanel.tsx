"use client";

import { Badge } from "@/components/ui/badge";
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
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">
        {selectedDateLabel
          ? `Tarefas em ${selectedDateLabel}`
          : "Selecione um dia"}
      </h3>

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
            <div key={task.id} className="rounded-lg border p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{task.title}</span>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[task.priority]}>
                    {priorityLabels[task.priority]}
                  </Badge>
                  <Badge className={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {task.description.trim() === ""
                  ? "Sem descrição."
                  : task.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Prazo: {formatDateLabel(task.dueDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
