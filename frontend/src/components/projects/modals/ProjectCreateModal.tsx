"use client";

import { ProjectFormFields } from "@/components/projects/modals/ProjectFormFields";
import { ProjectModalShell } from "@/components/projects/modals/ProjectModalShell";
import { Button } from "@/components/ui/button";
import type { ProjectFormValues, ProjectStatus } from "@/lib/projects/types";

interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formValues: ProjectFormValues;
  isSubmitting: boolean;
  submitError: string | null;
  statusEntries: Array<[ProjectStatus, { label: string; className: string }]>;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => void;
}

export function ProjectCreateModal({
  open,
  onOpenChange,
  title,
  description,
  formValues,
  isSubmitting,
  submitError,
  statusEntries,
  onCancel,
  onSubmit,
  handleChange,
}: ProjectCreateModalProps) {
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
        {isSubmitting ? "Criando..." : "Criar Projeto"}
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
          handleChange={handleChange}
        />
      }
      footerActions={footerActions}
    />
  );
}
