"use client";

import { TaskCreateModal } from "@/components/tasks/modals/TaskCreateModal";
import { TaskEditModal } from "@/components/tasks/modals/TaskEditModal";
import { useTaskDetailsFormController } from "@/lib/tasks/useTaskDetailsFormController";
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context";

export function TaskDetailsModal() {
  const {
    projects,
    isTaskModalOpen,
    taskModalMode,
    selectedTask,
    handleTaskModalOpenChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTaskFromModal,
  } = useTasksPageContext();

  const {
    formValues,
    isSubmitting,
    submitError,
    statusEntries,
    priorityEntries,
    modalTitle,
    modalDescription,
    handleChange,
    handleCancel,
    handleSubmit,
    handleDeleteAction,
  } = useTaskDetailsFormController({
    open: isTaskModalOpen,
    mode: taskModalMode,
    initialTask: selectedTask,
    onOpenChange: handleTaskModalOpenChange,
    onCreate: handleCreateTask,
    onUpdate: handleUpdateTask,
    onDelete: handleDeleteTaskFromModal,
  });

  if (taskModalMode === "edit" && !selectedTask) {
    return null;
  }

  if (taskModalMode === "create") {
    return (
      <TaskCreateModal
        open={isTaskModalOpen}
        onOpenChange={handleTaskModalOpenChange}
        title={modalTitle}
        description={modalDescription}
        formValues={formValues}
        isSubmitting={isSubmitting}
        submitError={submitError}
        statusEntries={statusEntries}
        priorityEntries={priorityEntries}
        projects={projects}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        handleChange={handleChange}
      />
    );
  }

  return (
    <TaskEditModal
      open={isTaskModalOpen}
      onOpenChange={handleTaskModalOpenChange}
      title={modalTitle}
      description={modalDescription}
      formValues={formValues}
      isSubmitting={isSubmitting}
      submitError={submitError}
      statusEntries={statusEntries}
      priorityEntries={priorityEntries}
      projects={projects}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      onDelete={() => void handleDeleteAction()}
      handleChange={handleChange}
    />
  );
}
