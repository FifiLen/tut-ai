"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { EditorProject } from "@/types/project"

interface EditorWorkspaceShellProps {
  currentProjectId: string | null
  ownedProjects: EditorProject[]
  sharedProjects: EditorProject[]
}

export function EditorWorkspaceShell({
  currentProjectId,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const projectActions = useProjectActions({
    currentProjectId,
    ownedProjects,
    sharedProjects,
  })

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <main className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          currentProjectId={projectActions.currentProjectId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectActions.openCreateDialog}
          onDeleteProject={projectActions.openDeleteDialog}
          onRenameProject={projectActions.openRenameDialog}
          onSelectProject={projectActions.selectProject}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />
        <div className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
          <div className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
            <p className="text-balance font-heading text-3xl font-semibold text-copy-primary sm:text-4xl">
              Create a project or open an existing one
            </p>
            <p className="mt-4 max-w-xl text-balance text-sm leading-6 text-copy-secondary sm:text-base">
              Start a new architecture workspace, or choose a project from the
              sidebar.
            </p>
            <Button
              className="mt-8"
              size="lg"
              onClick={projectActions.openCreateDialog}
            >
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>
        </div>
      </main>
      <ProjectDialogs dialogs={projectActions} />
    </div>
  )
}
