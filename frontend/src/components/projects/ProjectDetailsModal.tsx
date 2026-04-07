"use client";

import { useState } from "react";
import { ProjectCreateModal } from "@/components/projects/modals/ProjectCreateModal";
import { ProjectEditModal } from "@/components/projects/modals/ProjectEditModal";
import { useProjectsPageContext } from "@/lib/projects/projects-page-context";
import { useProjectDetailsFormController } from "@/lib/projects/useProjectDetailsFormController";

export function ProjectDetailsModal() {
  const {
    isModalOpen,
    modalMode,
    selectedProject,
    handleModalOpenChange,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProjectFromModal,
  } = useProjectsPageContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    isSubmitting,
    submitError,
    formValues,
    statusEntries,
    modalTitle,
    modalDescription,
    handleChange,
    handleSubmit,
  } = useProjectDetailsFormController({
    open: isModalOpen,
    mode: modalMode,
    project: selectedProject,
    onOpenChange: handleModalOpenChange,
    onCreate: handleCreateProject,
    onUpdate: handleUpdateProject,
  });

  if (modalMode === "view" && !selectedProject) {
    return null;
  }

  if (modalMode === "create") {
    return (
      <ProjectCreateModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        title={modalTitle}
        description={modalDescription}
        formValues={formValues}
        isSubmitting={isSubmitting}
        submitError={submitError}
        statusEntries={statusEntries}
        onCancel={() => handleModalOpenChange(false)}
        onSubmit={handleSubmit}
        handleChange={handleChange}
      />
    );
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) {
      return;
    }

    setIsDeleting(true);

    try {
      await handleDeleteProjectFromModal(selectedProject.id);
      handleModalOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProjectEditModal
      open={isModalOpen}
      onOpenChange={handleModalOpenChange}
      title={modalTitle}
      description={modalDescription}
      formValues={formValues}
      isSubmitting={isSubmitting}
      isDeleting={isDeleting}
      submitError={submitError}
      statusEntries={statusEntries}
      onCancel={() => handleModalOpenChange(false)}
      onSubmit={handleSubmit}
      onDelete={() => void handleDeleteProject()}
      handleChange={handleChange}
    />
  );
}
