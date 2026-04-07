"use client"

import dynamic from "next/dynamic"

const KanbanBoardNoSSR = dynamic(
  () => import("@/components/tasks/KanbanBoard").then((module) => module.KanbanBoard),
  {
    ssr: false,
    loading: () => <div className="min-h-[22rem] rounded-2xl border bg-muted/30" />,
  },
)

export function TasksKanbanClient() {
  return <KanbanBoardNoSSR />
}
