"use client";

import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectCardItem } from "@/lib/projects/types";
import { taskPriorityConfig, taskStatusConfig } from "@/lib/tasks/task-meta";
import type { TaskPriority, TaskStatus } from "@/lib/tasks/types";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: number | null;
}

interface TaskFormFieldsProps {
  formValues: TaskFormValues;
  isSubmitting: boolean;
  submitError: string | null;
  statusEntries: Array<[TaskStatus, { label: string; className: string }]>;
  priorityEntries: Array<[TaskPriority, { label: string; className: string }]>;
  projects: ProjectCardItem[];
  topContent?: ReactNode;
  showDeleteAction?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  handleChange: <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => void;
}

function dateStringToLocalDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function dateToDateString(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function TaskFormFields({
  formValues,
  isSubmitting,
  submitError,
  statusEntries,
  priorityEntries,
  projects,
  topContent,
  showDeleteAction = false,
  onDelete,
  isDeleting = false,
  handleChange,
}: TaskFormFieldsProps) {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  return (
    <>
      {submitError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

      {topContent}

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Titulo</Label>
        <Input
          className="hover:bg-accent"
          id="task-title"
          value={formValues.title}
          onChange={(event) => handleChange("title", event.target.value)}
          placeholder="Nome da tarefa"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-description">Descrição</Label>
        <Textarea
          id="task-description"
          value={formValues.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Descreva o objetivo e o contexto da tarefa"
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-status">Status</Label>
          <Select
            value={formValues.status}
            onValueChange={(value) => handleChange("status", value as TaskStatus)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="task-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusEntries.map(([statusValue, status]) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="task-priority">Prioridade</Label>
          <Select
            value={formValues.priority}
            onValueChange={(value) =>
              handleChange("priority", value as TaskPriority)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger id="task-priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityEntries.map(([priorityValue, priority]) => (
                <SelectItem key={priorityValue} value={priorityValue}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-due-date">Prazo</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="task-due-date"
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {formValues.dueDate
                  ? dateStringToLocalDate(formValues.dueDate)?.toLocaleDateString(
                      "pt-BR",
                    )
                  : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateStringToLocalDate(formValues.dueDate)}
                onSelect={(selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }

                  handleChange("dueDate", dateToDateString(selectedDate));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="task-project">Projeto</Label>
          <Select
            value={
              formValues.projectId === null ? "none" : String(formValues.projectId)
            }
            onValueChange={(value) => {
              handleChange("projectId", value === "none" ? null : Number(value));
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger id="task-project" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem projeto</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className={cn("font-medium", taskStatusConfig[formValues.status].className)}
        >
          {taskStatusConfig[formValues.status].label}
        </Badge>
        <Badge
          variant="secondary"
          className={cn(
            "font-medium",
            taskPriorityConfig[formValues.priority].className,
          )}
        >
          {taskPriorityConfig[formValues.priority].label}
        </Badge>
        {showDeleteAction ? (
          <Popover
            open={isDeletePopoverOpen}
            onOpenChange={setIsDeletePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isSubmitting || isDeleting}
                aria-label="Excluir tarefa"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-3">
              <p className="text-sm text-foreground">
                Excluir esta tarefa permanentemente?
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeletePopoverOpen(false)}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isSubmitting || isDeleting}
                  onClick={() => {
                    onDelete?.();
                    setIsDeletePopoverOpen(false);
                  }}
                >
                  {isDeleting ? "Excluindo..." : "Confirmar"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </>
  );
}

export type { TaskFormFieldsProps };
