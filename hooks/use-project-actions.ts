"use client"

import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import type { EditorProject } from "@/types/project"

export type ProjectDialogType = "create" | "rename" | "delete" | null

export interface UseProjectActionsOptions {
  currentProjectId: string | null
  ownedProjects: EditorProject[]
  sharedProjects: EditorProject[]
}

export interface UseProjectActionsResult {
  activeDialog: ProjectDialogType
  activeProject: EditorProject | null
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
  roomIdPreview: string
  selectProject: (projectId: string) => void
  setProjectName: (value: string) => void
}

const FALLBACK_SLUG = "untitled-project"

export function useProjectActions({
  currentProjectId,
  ownedProjects,
  sharedProjects,
}: UseProjectActionsOptions): UseProjectActionsResult {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [createSuffix, setCreateSuffix] = useState(() => createShortSuffix())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projects = useMemo(
    () => [...ownedProjects, ...sharedProjects],
    [ownedProjects, sharedProjects],
  )
  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null
  const roomIdPreview = createRoomId(projectName, createSuffix)

  function openCreateDialog() {
    setActiveProjectId(null)
    setProjectName("")
    setCreateSuffix(createShortSuffix())
    setActiveDialog("create")
  }

  function openRenameDialog(projectId: string) {
    const project = ownedProjects.find((entry) => entry.id === projectId)

    if (!project) {
      return
    }

    setActiveProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("rename")
  }

  function openDeleteDialog(projectId: string) {
    const project = ownedProjects.find((entry) => entry.id === projectId)

    if (!project) {
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

    try {
      const project = await requestProjectCreate(name, roomIdPreview)

      resetDialog()
      router.push(`/editor/${project.id}`)
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = projectName.trim()

    if (!name || !activeProjectId) {
      return
    }

    setIsSubmitting(true)

    try {
      await requestProjectRename(activeProjectId, name)
      resetDialog()
      router.refresh()
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteSubmit() {
    if (!activeProjectId) {
      return
    }

    const deletedProjectId = activeProjectId

    setIsSubmitting(true)

    try {
      await requestProjectDelete(deletedProjectId)
      resetDialog()

      if (deletedProjectId === currentProjectId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function selectProject(projectId: string) {
    router.push(`/editor/${projectId}`)
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
    roomIdPreview,
    selectProject,
    setProjectName,
  }
}

function createRoomId(name: string, suffix: string) {
  return `${slugify(name)}-${suffix}`
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "")

  return slug || FALLBACK_SLUG
}

function createShortSuffix() {
  const randomValues = new Uint32Array(1)
  crypto.getRandomValues(randomValues)

  return randomValues[0].toString(36).slice(0, 6).padStart(6, "0")
}

async function requestProjectCreate(name: string, id: string) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body, "Could not create project."))
  }

  return parseProjectResponse(body)
}

async function requestProjectRename(projectId: string, name: string) {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(getApiErrorMessage(body, "Could not rename project."))
  }
}

async function requestProjectDelete(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const body = await parseResponseBody(response)

    throw new Error(getApiErrorMessage(body, "Could not delete project."))
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  return response.json()
}

function parseProjectResponse(body: unknown) {
  if (
    !body ||
    typeof body !== "object" ||
    !("data" in body) ||
    !body.data ||
    typeof body.data !== "object" ||
    !("project" in body.data) ||
    !body.data.project ||
    typeof body.data.project !== "object" ||
    !("id" in body.data.project) ||
    typeof body.data.project.id !== "string"
  ) {
    throw new Error("Project response was invalid.")
  }

  return { id: body.data.project.id }
}

function getApiErrorMessage(body: unknown, fallback: string) {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    body.error &&
    typeof body.error === "object" &&
    "message" in body.error &&
    typeof body.error.message === "string"
  ) {
    return body.error.message
  }

  return fallback
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong."
}
