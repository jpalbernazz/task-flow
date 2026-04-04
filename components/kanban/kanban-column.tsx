"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/kanban/task-card";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  isDragOver: boolean;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (status: TaskStatus) => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDrop,
}: KanbanColumnProps) {
  const [isOverColumn, setIsOverColumn] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsOverColumn(true);
  };

  const handleDragLeave = () => {
    setIsOverColumn(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsOverColumn(false);
    onDrop(id);
  };

  return (
    <div
      className={cn(
        "flex min-h-[500px] w-80 shrink-0 flex-col rounded-xl bg-muted/50 transition-colors",
        isOverColumn && isDragOver && "bg-primary/10 ring-2 ring-primary/30",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", color)} />
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Adicionar tarefa</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-0">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
