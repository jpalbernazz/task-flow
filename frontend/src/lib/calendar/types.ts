import type { TaskViewModel } from "@/lib/tasks/types"

export type CalendarTask = Pick<TaskViewModel, "id" | "title" | "description" | "dueDate" | "priority" | "status">
