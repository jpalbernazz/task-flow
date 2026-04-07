import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/get-error-message";
import { isValidDate } from "@/lib/is-valid-date";
import { taskPriorityConfig, taskStatusConfig } from "@/lib/tasks/task-meta";
import type {
  TaskModalMode,
  TaskPriority,
  TaskStatus,
  TaskViewModel,
} from "@/lib/tasks/types";
import type { CreateTaskInput, UpdateTaskInput } from "@/services/task-service";

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: number | null;
}

interface UseTaskDetailsFormControllerParams {
  open: boolean;
  mode: TaskModalMode;
  initialTask: TaskViewModel | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateTaskInput) => Promise<void>;
  onUpdate: (taskId: number, input: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

function buildDefaultTaskValues(): TaskFormValues {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  return {
    title: "Nova tarefa",
    description: "Descrição da nova tarefa",
    status: "todo",
    priority: "medium",
    dueDate: nextDay.toISOString().slice(0, 10),
    projectId: null,
  };
}

function normalizeDateOnly(value: string): string {
  if (!value) {
    return value;
  }

  const [datePart] = value.split("T");
  return datePart;
}

function taskToFormValues(task: TaskViewModel): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: normalizeDateOnly(task.dueDate),
    projectId: task.projectId,
  };
}

export function useTaskDetailsFormController({
  open,
  mode,
  initialTask,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete,
}: UseTaskDetailsFormControllerParams) {
  const [formValues, setFormValues] = useState<TaskFormValues>(
    buildDefaultTaskValues,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const statusEntries = useMemo(() => {
    return Object.entries(taskStatusConfig) as Array<
      [TaskStatus, { label: string; className: string }]
    >;
  }, []);

  const priorityEntries = useMemo(() => {
    return Object.entries(taskPriorityConfig) as Array<
      [TaskPriority, { label: string; className: string }]
    >;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "create") {
      setFormValues(buildDefaultTaskValues());
    } else if (initialTask) {
      setFormValues(taskToFormValues(initialTask));
    }

    setSubmitError(null);
    setIsDeleteConfirming(false);
  }, [open, mode, initialTask]);

  const modalTitle = mode === "create" ? "Nova Tarefa" : "Editar Tarefa";
  const modalDescription =
    mode === "create"
      ? "Preencha os dados principais para criar uma nova tarefa."
      : "Ajuste os dados da tarefa e mantenha o quadro atualizado.";

  const handleChange = <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = formValues.title.trim();
    const normalizedDescription = formValues.description.trim();

    if (normalizedTitle === "") {
      setSubmitError("O titulo da tarefa e obrigatorio.");
      return;
    }
    if (normalizedDescription === "") {
      setSubmitError("A descrição da tarefa e obrigatoria.");
      return;
    }
    if (!isValidDate(formValues.dueDate)) {
      setSubmitError("Informe uma data de prazo valida.");
      return;
    }
    if (!(formValues.status in taskStatusConfig)) {
      setSubmitError("Selecione um status valido.");
      return;
    }
    if (!(formValues.priority in taskPriorityConfig)) {
      setSubmitError("Selecione uma prioridade valida.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (mode === "create") {
        await onCreate({
          title: normalizedTitle,
          description: normalizedDescription,
          status: formValues.status,
          priority: formValues.priority,
          dueDate: formValues.dueDate,
          projectId: formValues.projectId,
        });
      } else if (initialTask) {
        await onUpdate(initialTask.id, {
          title: normalizedTitle,
          description: normalizedDescription,
          status: formValues.status,
          priority: formValues.priority,
          dueDate: formValues.dueDate,
          projectId: formValues.projectId,
        });
      }

      onOpenChange(false);
    } catch (error) {
      const fallback =
        mode === "create"
          ? "Nao foi possivel criar a tarefa."
          : "Nao foi possivel atualizar a tarefa.";
      setSubmitError(getErrorMessage(error, fallback));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAction = async () => {
    if (mode !== "edit" || !initialTask) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onDelete(initialTask.id);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Nao foi possivel excluir a tarefa."),
      );
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirming(false);
    }
  };

  return {
    formValues,
    isSubmitting,
    submitError,
    isDeleteConfirming,
    statusEntries,
    priorityEntries,
    modalTitle,
    modalDescription,
    setIsDeleteConfirming,
    handleChange,
    handleCancel,
    handleSubmit,
    handleDeleteAction,
  };
}
