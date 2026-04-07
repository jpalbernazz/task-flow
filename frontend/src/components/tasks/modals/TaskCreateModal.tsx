"use client";

import { Button } from "@/components/ui/button";
import { TaskFormFields, type TaskFormValues } from "@/components/tasks/modals/TaskFormFields";
import { TaskModalShell } from "@/components/tasks/modals/TaskModalShell";
import type { ProjectCardItem } from "@/lib/projects/types";
import type { TaskPriority, TaskStatus } from "@/lib/tasks/types";

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formValues: TaskFormValues;
  isSubmitting: boolean;
  submitError: string | null;
  statusEntries: Array<[TaskStatus, { label: string; className: string }]>;
  priorityEntries: Array<[TaskPriority, { label: string; className: string }]>;
  projects: ProjectCardItem[];
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => void;
}

export function TaskCreateModal({
  open,
  onOpenChange,
  title,
  description,
  formValues,
  isSubmitting,
  submitError,
  statusEntries,
  priorityEntries,
  projects,
  onCancel,
  onSubmit,
  handleChange,
}: TaskCreateModalProps) {
  const footerActions = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar Tarefa"}
      </Button>
    </>
  );

  return (
    <TaskModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSubmit={onSubmit}
      body={
        <TaskFormFields
          formValues={formValues}
          isSubmitting={isSubmitting}
          submitError={submitError}
          statusEntries={statusEntries}
          priorityEntries={priorityEntries}
          projects={projects}
          handleChange={handleChange}
        />
      }
      footerActions={footerActions}
    />
  );
}
