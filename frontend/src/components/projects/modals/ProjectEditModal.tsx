"use client";

import { ProjectFormFields } from "@/components/projects/modals/ProjectFormFields";
import { ProjectModalShell } from "@/components/projects/modals/ProjectModalShell";
import { Button } from "@/components/ui/button";
import type { ProjectFormValues, ProjectStatus } from "@/lib/projects/types";

interface ProjectEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formValues: ProjectFormValues;
  isSubmitting: boolean;
  isDeleting: boolean;
  submitError: string | null;
  statusEntries: Array<[ProjectStatus, { label: string; className: string }]>;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  handleChange: <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => void;
}

export function ProjectEditModal({
  open,
  onOpenChange,
  title,
  description,
  formValues,
  isSubmitting,
  isDeleting,
  submitError,
  statusEntries,
  onCancel,
  onSubmit,
  onDelete,
  handleChange,
}: ProjectEditModalProps) {
  const footerActions = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting || isDeleting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting || isDeleting}>
        {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
      </Button>
    </>
  );

  return (
    <ProjectModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSubmit={onSubmit}
      body={
        <ProjectFormFields
          formValues={formValues}
          isSubmitting={isSubmitting}
          submitError={submitError}
          statusEntries={statusEntries}
          showDeleteAction
          onDelete={onDelete}
          isDeleting={isDeleting}
          handleChange={handleChange}
        />
      }
      footerActions={footerActions}
    />
  );
}
