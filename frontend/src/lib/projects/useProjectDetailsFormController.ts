import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/get-error-message";
import { isValidDate } from "@/lib/is-valid-date";
import { projectStatusConfig } from "@/lib/projects/project-status";
import type {
  ProjectCardItem,
  ProjectFormValues,
  ProjectModalMode,
  ProjectStatus,
} from "@/lib/projects/types";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/services/project-service";

interface UseProjectDetailsFormControllerParams {
  open: boolean;
  mode: ProjectModalMode;
  project: ProjectCardItem | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateProjectInput) => Promise<void>;
  onUpdate: (projectId: number, input: UpdateProjectInput) => Promise<void>;
}

function buildDefaultFormValues(): ProjectFormValues {
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  return {
    name: "Novo Projeto",
    description: "Descrição do novo projeto",
    deadline: nextMonth.toISOString().slice(0, 10),
    status: "planejado",
  };
}

function normalizeDateOnly(value: string): string {
  if (!value) {
    return value;
  }

  const [datePart] = value.split("T");
  return datePart;
}

function projectToFormValues(project: ProjectCardItem): ProjectFormValues {
  return {
    name: project.name,
    description: project.description,
    deadline: normalizeDateOnly(project.deadline),
    status: project.status,
  };
}

export function useProjectDetailsFormController({
  open,
  mode,
  project,
  onOpenChange,
  onCreate,
  onUpdate,
}: UseProjectDetailsFormControllerParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProjectFormValues>(
    buildDefaultFormValues,
  );

  const statusEntries = useMemo(() => {
    return Object.entries(projectStatusConfig) as Array<
      [ProjectStatus, { label: string; className: string }]
    >;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "create") {
      setFormValues(buildDefaultFormValues());
    } else if (project) {
      setFormValues(projectToFormValues(project));
    }

    setSubmitError(null);
  }, [open, mode, project]);

  const modalTitle = mode === "create" ? "Novo Projeto" : "Editar Projeto";

  const modalDescription =
    mode === "create"
      ? "Preencha os dados principais para criar um novo projeto."
      : "Atualize os dados principais do projeto.";

  const handleChange = <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = formValues.name.trim();
    const normalizedDescription = formValues.description.trim();

    if (normalizedName === "") {
      setSubmitError("O nome do projeto é obrigatório.");
      return;
    }

    if (normalizedDescription === "") {
      setSubmitError("A descrição do projeto é obrigatória.");
      return;
    }

    if (!isValidDate(formValues.deadline)) {
      setSubmitError("Informe um prazo válido.");
      return;
    }

    if (!(formValues.status in projectStatusConfig)) {
      setSubmitError("Selecione um status válido.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await onCreate({
          name: normalizedName,
          description: normalizedDescription,
          deadline: formValues.deadline,
          status: formValues.status,
          progress: 0,
          tasksCompleted: 0,
          totalTasks: 0,
        });
      } else if (project) {
        await onUpdate(project.id, {
          name: normalizedName,
          description: normalizedDescription,
          deadline: formValues.deadline,
          status: formValues.status,
        });
      }

      onOpenChange(false);
    } catch (error) {
      const fallback =
        mode === "create"
          ? "Não foi possível criar o projeto."
          : "Não foi possível atualizar o projeto.";
      setSubmitError(getErrorMessage(error, fallback));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    formValues,
    statusEntries,
    modalTitle,
    modalDescription,
    handleChange,
    handleSubmit,
  };
}
