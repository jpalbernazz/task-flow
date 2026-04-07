"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CalendarPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Calendário
        </h1>
        <p className="pl-0.5 text-muted-foreground">
          Visualize suas tarefas e prazos
        </p>
      </div>
      <Button className="gap-2" disabled>
        <Plus className="h-4 w-4" />
        Novo Evento
      </Button>
    </div>
  );
}
