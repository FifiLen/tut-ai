"use client"

import type { FormEvent } from "react"
import { useState } from "react"

export interface ProjectRecord {
  id: string
  name: string
  ownership: "owned" | "shared"
  role?: string
  slug: string
}

export type ProjectDialogType = "create" | "rename" | "delete" | null

export interface UseProjectDialogsResult {
  activeDialog: ProjectDialogType
  activeProject: ProjectRecord | null
  closeDialog: () => void
  currentProjectId: string | null
  handleCreateSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleDeleteSubmit: () => Promise<void>
  handleRenameSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
  openCreateDialog: () => void
  openDeleteDialog: (projectId: string) => void
  openRenameDialog: (projectId: string) => void
  projectName: string
  projects: ProjectRecord[]
  selectProject: (projectId: string) => void
  setProjectName: (value: string) => void
  slugPreview: string
}

const MOCK_PROJECTS: ProjectRecord[] = [
  {
    id: "proj-ghost",
    name: "Ghost Platform",
    slug: "ghost-platform",
    ownership: "owned",
  },
  {
    id: "proj-billing",
    name: "Billing Runtime",
    slug: "billing-runtime",
    ownership: "owned",
  },
  {
    id: "proj-onboarding",
    name: "Customer Onboarding",
    slug: "customer-onboarding",
    ownership: "shared",
    role: "Can edit",
  },
]

const FALLBACK_SLUG = "untitled-project"

export function useProjectDialogs(): UseProjectDialogsResult {
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    MOCK_PROJECTS[0]?.id ?? null,
  )
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null
  const slugPreview = createProjectSlug(projectName)

  function openCreateDialog() {
    setActiveProjectId(null)
    setProjectName("")
    setActiveDialog("create")
  }

  function openRenameDialog(projectId: string) {
    const project = projects.find((entry) => entry.id === projectId)

    if (!project || project.ownership !== "owned") {
      return
    }

    setActiveProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("rename")
  }

  function openDeleteDialog(projectId: string) {
    const project = projects.find((entry) => entry.id === projectId)

    if (!project || project.ownership !== "owned") {
      return
    }

    setActiveProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("delete")
  }

  function closeDialog() {
    if (isSubmitting) {
      return
    }

    resetDialog()
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = projectName.trim()

    if (!name) {
      return
    }

    setIsSubmitting(true)
    await waitForMockMutation()

    const slug = createProjectSlug(name)
    const newProject: ProjectRecord = {
      id: `proj-${crypto.randomUUID()}`,
      name,
      slug,
      ownership: "owned",
    }

    setProjects((currentProjects) => [newProject, ...currentProjects])
    setCurrentProjectId(newProject.id)
    setIsSubmitting(false)
    resetDialog()
  }

  async function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = projectName.trim()

    if (!name || !activeProjectId) {
      return
    }

    setIsSubmitting(true)
    await waitForMockMutation()

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              name,
              slug: createProjectSlug(name),
            }
          : project,
      ),
    )

    setIsSubmitting(false)
    resetDialog()
  }

  async function handleDeleteSubmit() {
    if (!activeProjectId) {
      return
    }

    setIsSubmitting(true)
    await waitForMockMutation()

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== activeProjectId),
    )
    setCurrentProjectId((currentProject) =>
      currentProject === activeProjectId ? null : currentProject,
    )
    setIsSubmitting(false)
    resetDialog()
  }

  function selectProject(projectId: string) {
    setCurrentProjectId(projectId)
  }

  function resetDialog() {
    setActiveDialog(null)
    setActiveProjectId(null)
    setProjectName("")
  }

  return {
    activeDialog,
    activeProject,
    closeDialog,
    currentProjectId,
    handleCreateSubmit,
    handleDeleteSubmit,
    handleRenameSubmit,
    isSubmitting,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    projectName,
    projects,
    selectProject,
    setProjectName,
    slugPreview,
  }
}

function createProjectSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || FALLBACK_SLUG
}

function waitForMockMutation() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 150)
  })
}
