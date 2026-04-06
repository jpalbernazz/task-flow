"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { TaskDetailsModal, type TaskModalMode } from "./task-details-modal";
import {
  createTask,
  deleteTask,
  getTasks,
  type CreateTaskInput,
  type UpdateTaskInput,
  updateTask,
} from "@/services/task-service";
import { getProjectCards } from "@/services/project-service";
import type { ProjectCardItem } from "@/lib/projects/types";
import type {
  KanbanColumnData,
  TaskStatus,
  TaskViewModel,
} from "@/lib/tasks/types";
import { KanbanBoard } from "./kanban-board";

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-muted-foreground/70" },
  { id: "in_progress", title: "Em Progresso", color: "bg-primary" },
  { id: "done", title: "Concluida", color: "bg-success" },
];

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return fallbackMessage;
}

function buildKanbanColumns(tasks: TaskViewModel[]): KanbanColumnData[] {
  return baseColumns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));
}

interface TasksPageViewProps {
  initialTasks: TaskViewModel[];
  initialError?: string | null;
}

interface ProjectFilterOption {
  value: string;
  label: string;
}

export function TasksPageView({
  initialTasks,
  initialError = null,
}: TasksPageViewProps) {
  const [tasks, setTasks] = useState<TaskViewModel[]>(initialTasks);
  const [projects, setProjects] = useState<ProjectCardItem[]>([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>("create");
  const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null);
  const projectFilterAnchor = useComboboxAnchor();

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const [taskList, projectList] = await Promise.all([
        getTasks(),
        getProjectCards(),
      ]);
      setTasks(taskList);
      setProjects(projectList);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Nao foi possivel carregar as tarefas."),
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const projectsById = useMemo(() => {
    return projects.reduce<Record<number, ProjectCardItem>>(
      (accumulator, project) => {
        accumulator[project.id] = project;
        return accumulator;
      },
      {},
    );
  }, [projects]);

  const filteredTasks = useMemo(() => {
    if (selectedProjectFilter === "all") {
      return tasks;
    }

    const projectId = Number(selectedProjectFilter);
    if (!Number.isInteger(projectId)) {
      return tasks;
    }

    return tasks.filter((task) => task.projectId === projectId);
  }, [selectedProjectFilter, tasks]);

  const columns = useMemo(
    () => buildKanbanColumns(filteredTasks),
    [filteredTasks],
  );
  const projectFilterOptions = useMemo<ProjectFilterOption[]>(() => {
    return [
      { value: "all", label: "Todos os projetos" },
      ...projects.map((project) => ({
        value: String(project.id),
        label: project.name,
      })),
    ];
  }, [projects]);

  const selectedProjectOption = useMemo<ProjectFilterOption>(() => {
    return (
      projectFilterOptions.find(
        (option) => option.value === selectedProjectFilter,
      ) ?? projectFilterOptions[0]
    );
  }, [projectFilterOptions, selectedProjectFilter]);

  const handleCreateTask = useCallback(
    async (input: CreateTaskInput) => {
      try {
        await createTask(input);
        setInfoMessage("Tarefa criada com sucesso.");
        setErrorMessage(null);
        await refreshData();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, "Nao foi possivel criar a tarefa."),
        );
        throw error;
      }
    },
    [refreshData],
  );

  const handleMoveTask = useCallback(
    async (taskId: number, status: TaskStatus) => {
      try {
        const updatedTask = await updateTask(taskId, { status });
        if (!updatedTask) {
          setErrorMessage(
            "A tarefa nao foi encontrada para atualizar o status.",
          );
          return;
        }

        await refreshData();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(
            error,
            "Nao foi possivel atualizar o status da tarefa.",
          ),
        );
      }
    },
    [refreshData],
  );

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId);
        if (!deleted) {
          setErrorMessage("A tarefa nao foi encontrada para exclusao.");
          return;
        }

        setInfoMessage("Tarefa excluida com sucesso.");
        setErrorMessage(null);
        await refreshData();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, "Nao foi possivel excluir a tarefa."),
        );
      }
    },
    [refreshData],
  );

  const handleUpdateTask = useCallback(
    async (taskId: number, payload: UpdateTaskInput) => {
      try {
        const updatedTask = await updateTask(taskId, payload);
        if (!updatedTask) {
          const notFoundError = new Error(
            "A tarefa nao foi encontrada para edicao.",
          );
          setErrorMessage(notFoundError.message);
          throw notFoundError;
        }

        setInfoMessage("Tarefa atualizada com sucesso.");
        setErrorMessage(null);
        await refreshData();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, "Nao foi possivel editar a tarefa."),
        );
        throw error;
      }
    },
    [refreshData],
  );

  const handleDeleteTaskFromModal = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId);
        if (!deleted) {
          const notFoundError = new Error(
            "A tarefa nao foi encontrada para exclusao.",
          );
          setErrorMessage(notFoundError.message);
          throw notFoundError;
        }

        setInfoMessage("Tarefa excluida com sucesso.");
        setErrorMessage(null);
        await refreshData();
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, "Nao foi possivel excluir a tarefa."),
        );
        throw error;
      }
    },
    [refreshData],
  );

  const handleTaskModalOpenChange = (open: boolean) => {
    setIsTaskModalOpen(open);

    if (!open) {
      setTaskModalMode("create");
      setSelectedTask(null);
    }
  };

  const handleOpenCreateTaskModal = () => {
    setTaskModalMode("create");
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: TaskViewModel) => {
    setTaskModalMode("edit");
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void refreshData()}
                disabled={isRefreshing}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
            {infoMessage}
          </div>
        ) : null}

        {isRefreshing ? (
          <p className="text-sm text-muted-foreground">
            Atualizando tarefas...
          </p>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Tarefas
            </h1>
            <p className="pl-0.5 text-sm text-muted-foreground ">
              Gerencie suas tarefas com o quadro Kanban
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Combobox
              value={selectedProjectOption}
              onValueChange={(value) =>
                setSelectedProjectFilter(value?.value ?? "all")
              }
              items={projectFilterOptions}
              isItemEqualToValue={(item, value) => item.value === value.value}
            >
              <div ref={projectFilterAnchor} className="w-fit max-w-full">
                <ComboboxInput
                  aria-label="Filtrar por projeto"
                  placeholder="Todos os projetos"
                  size={1}
                  className="w-fit max-w-full **:data-[slot=input-group-control]:w-auto **:data-[slot=input-group-control]:field-sizing-content cursor-pointer **:data-[slot=input-group-control]:cursor-pointer **:data-[slot=input-group-addon]:cursor-pointer **:data-[slot=input-group-button]:cursor-pointer"
                  showClear={selectedProjectFilter !== "all"}
                >
                  <InputGroupAddon align="inline-start">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                </ComboboxInput>
              </div>

              <ComboboxContent
                anchor={projectFilterAnchor}
                className="w-(--anchor-width)! min-w-(--anchor-width)! max-w-(--anchor-width)!"
              >
                <ComboboxEmpty>Nenhum projeto encontrado.</ComboboxEmpty>
                <ComboboxList>
                  <ComboboxCollection>
                    {(option: ProjectFilterOption) => (
                      <ComboboxItem key={option.value} value={option}>
                        {option.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Button onClick={handleOpenCreateTaskModal}>
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <KanbanBoard
          columns={columns}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
          onOpenEditTask={handleOpenEditTaskModal}
          getProjectName={(projectId) => {
            if (projectId === null) {
              return null;
            }

            return projectsById[projectId]?.name ?? null;
          }}
        />
      </div>

      <TaskDetailsModal
        open={isTaskModalOpen}
        onOpenChange={handleTaskModalOpenChange}
        mode={taskModalMode}
        initialTask={selectedTask}
        projects={projects}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTaskFromModal}
      />
    </DashboardLayout>
  );
}

export default TasksPageView;
