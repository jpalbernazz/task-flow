"use client"

import { Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/Combobox"
import { InputGroupAddon } from "@/components/ui/InputGroup"
import type { ProjectFilterOption } from "@/lib/tasks/useTasksPageController"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"

export function TasksPageHeader() {
  const projectFilterAnchor = useComboboxAnchor()

  const {
    selectedProjectOption,
    selectedProjectFilter,
    projectFilterOptions,
    setSelectedProjectFilter,
    handleOpenCreateTaskModal,
  } = useTasksPageContext()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tarefas</h1>
        <p className="pl-0.5 text-sm text-muted-foreground ">
          Gerencie suas tarefas com o quadro Kanban
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Combobox
          value={selectedProjectOption}
          onValueChange={(value) => setSelectedProjectFilter(value?.value ?? "all")}
          items={projectFilterOptions}
          isItemEqualToValue={(item, value) => item.value === value.value}
        >
          <div ref={projectFilterAnchor} className="w-fit max-w-full">
            <ComboboxInput
              aria-label="Filtrar por projeto"
              placeholder="Todos os projetos"
              size={1}
              readOnly
              inputMode="none"
              autoComplete="off"
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
  )
}
