import type { TaskViewModel } from "@/lib/tasks/types";
import type { DashboardStat, RecentTaskItem, RecentTaskStatus } from "./types";

const MAX_RECENT_TASKS = 4;

function getPriorityWeight(priority: TaskViewModel["priority"]): number {
  if (priority === "high") {
    return 0;
  }

  if (priority === "medium") {
    return 1;
  }

  return 2;
}

function getStatusWeight(status: TaskViewModel["status"]): number {
  if (status === "todo") {
    return 0;
  }

  if (status === "in_progress") {
    return 1;
  }

  return 2;
}

function normalizeDateKey(value: string): string | null {
  const normalized = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function isTaskOverdue(task: TaskViewModel, todayDateKey: string): boolean {
  const dueDateKey = normalizeDateKey(task.dueDate);
  if (!dueDateKey) {
    return false;
  }

  return dueDateKey < todayDateKey && task.status !== "done";
}

function mapTaskToRecentStatus(
  task: TaskViewModel,
  overdue: boolean,
): RecentTaskStatus {
  if (overdue) {
    return "overdue";
  }

  if (task.status === "done") {
    return "completed";
  }

  if (task.status === "in_progress") {
    return "in-progress";
  }

  return "todo";
}

function formatDueDateLabel(dueDate: string, todayDateKey: string): string {
  const dueDateKey = normalizeDateKey(dueDate);
  if (!dueDateKey) {
    return dueDate;
  }

  if (dueDateKey === todayDateKey) {
    return "Hoje";
  }

  const dueDateObject = new Date(`${dueDateKey}T00:00:00`);
  const todayDateObject = new Date(`${todayDateKey}T00:00:00`);
  const diffInMs = dueDateObject.getTime() - todayDateObject.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 1) {
    return "Amanhã";
  }

  if (diffInDays === -1) {
    return "Ontem";
  }

  const [year, month, day] = dueDateKey.split("-");
  return `${day}/${month}/${year}`;
}

function compareTasksByRelevance(
  taskA: TaskViewModel,
  taskB: TaskViewModel,
  todayDateKey: string,
): number {
  const taskAIsOverdue = isTaskOverdue(taskA, todayDateKey);
  const taskBIsOverdue = isTaskOverdue(taskB, todayDateKey);
  if (taskAIsOverdue !== taskBIsOverdue) {
    return taskAIsOverdue ? -1 : 1;
  }

  const priorityDiff =
    getPriorityWeight(taskA.priority) - getPriorityWeight(taskB.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  const taskADateKey = normalizeDateKey(taskA.dueDate) ?? "9999-12-31";
  const taskBDateKey = normalizeDateKey(taskB.dueDate) ?? "9999-12-31";
  const dueDateDiff = taskADateKey.localeCompare(taskBDateKey);
  if (dueDateDiff !== 0) {
    return dueDateDiff;
  }

  const statusDiff =
    getStatusWeight(taskA.status) - getStatusWeight(taskB.status);
  if (statusDiff !== 0) {
    return statusDiff;
  }

  return taskA.id - taskB.id;
}

export function getTodayDateKey(today = new Date()): string {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildDashboardStats(
  tasks: TaskViewModel[],
  todayDateKey: string,
): DashboardStat[] {
  const tasksInProgress = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const overdueTasks = tasks.filter((task) =>
    isTaskOverdue(task, todayDateKey),
  ).length;

  return [
    {
      title: "Total de Tarefas",
      value: tasks.length,
      description: "Todas as tarefas",
      icon: "list",
      variant: "primary",
    },
    {
      title: "Em Progresso",
      value: tasksInProgress,
      description: "Tarefas em andamento",
      icon: "clock",
      variant: "primary",
    },
    {
      title: "Concluídas",
      value: completedTasks,
      description: "Tarefas finalizadas",
      icon: "check",
      variant: "success",
    },
    {
      title: "Atrasadas",
      value: overdueTasks,
      description: "Tarefas fora do prazo",
      icon: "alert",
      variant: "destructive",
    },
  ];
}

export function buildRecentTasks(
  tasks: TaskViewModel[],
  todayDateKey: string,
): RecentTaskItem[] {
  return tasks
    .slice()
    .sort((taskA, taskB) => compareTasksByRelevance(taskA, taskB, todayDateKey))
    .slice(0, MAX_RECENT_TASKS)
    .map((task) => {
      const overdue = isTaskOverdue(task, todayDateKey);
      const status = mapTaskToRecentStatus(task, overdue);
      const projectName =
        task.projectId === null
          ? "Sem projeto"
          : `Projeto #${task.projectId}`;

      return {
        id: String(task.id),
        title: task.title,
        project: projectName,
        status,
        priority: task.priority,
        dueDate: formatDueDateLabel(task.dueDate, todayDateKey),
      };
    });
}
