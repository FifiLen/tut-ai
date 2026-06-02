"use client"

import type { ReactNode } from "react"

import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditorDialogShell } from "@/components/editor/editor-dialog-shell"

import type {
  ProjectDialogType,
  UseProjectDialogsResult,
} from "@/hooks/use-project-dialogs"

interface ProjectDialogsProps {
  dialogs: UseProjectDialogsResult
}

export function ProjectDialogs({ dialogs }: ProjectDialogsProps) {
  return (
    <>
      <ProjectDialogRoot
        dialogType="create"
        dialogs={dialogs}
        title="Create Project"
        description="Set a project name to create a new architecture workspace."
      >
        <form className="space-y-5" onSubmit={dialogs.handleCreateSubmit}>
          <ProjectNameField
            value={dialogs.projectName}
            onChange={dialogs.setProjectName}
            autoFocus
          />
          <SlugPreview slug={dialogs.slugPreview} />
          <DialogActions
            isSubmitting={dialogs.isSubmitting}
            submitLabel="Create Project"
          />
        </form>
      </ProjectDialogRoot>

      <ProjectDialogRoot
        dialogType="rename"
        dialogs={dialogs}
        title="Rename Project"
        description={
          dialogs.activeProject
            ? `Current project: ${dialogs.activeProject.name}`
            : undefined
        }
      >
        <form className="space-y-5" onSubmit={dialogs.handleRenameSubmit}>
          <ProjectNameField
            value={dialogs.projectName}
            onChange={dialogs.setProjectName}
            autoFocus
          />
          <SlugPreview slug={dialogs.slugPreview} />
          <DialogActions
            isSubmitting={dialogs.isSubmitting}
            submitLabel="Save Changes"
          />
        </form>
      </ProjectDialogRoot>

      <ProjectDialogRoot
        dialogType="delete"
        dialogs={dialogs}
        title="Delete Project"
        description={
          dialogs.activeProject
            ? `Delete ${dialogs.activeProject.name}? This action cannot be undone.`
            : undefined
        }
      >
        <div className="space-y-5">
          <p className="text-sm text-copy-secondary">
            This removes the project from the current mock workspace list.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={dialogs.closeDialog}
              disabled={dialogs.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={dialogs.handleDeleteSubmit}
              disabled={dialogs.isSubmitting}
            >
              {dialogs.isSubmitting ? "Deleting..." : "Delete Project"}
            </Button>
          </div>
        </div>
      </ProjectDialogRoot>
    </>
  )
}

interface ProjectDialogRootProps {
  children: ReactNode
  description?: string
  dialogType: ProjectDialogType
  dialogs: UseProjectDialogsResult
  title: string
}

function ProjectDialogRoot({
  children,
  description,
  dialogType,
  dialogs,
  title,
}: ProjectDialogRootProps) {
  return (
    <Dialog
      open={dialogs.activeDialog === dialogType}
      onOpenChange={(open) => {
        if (!open) {
          dialogs.closeDialog()
        }
      }}
    >
      <EditorDialogShell title={title} description={description}>
        {children}
      </EditorDialogShell>
    </Dialog>
  )
}

interface ProjectNameFieldProps {
  autoFocus?: boolean
  onChange: (value: string) => void
  value: string
}

function ProjectNameField({
  autoFocus = false,
  onChange,
  value,
}: ProjectNameFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-copy-primary">Project name</span>
      <Input
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Architecture workspace"
      />
    </label>
  )
}

function SlugPreview({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-subtle/60 px-4 py-3">
      <p className="text-xs font-medium tracking-[0.14em] text-copy-faint uppercase">
        Slug preview
      </p>
      <p className="mt-2 text-sm text-copy-secondary">
        /projects/<span className="text-copy-primary">{slug}</span>
      </p>
    </div>
  )
}

function DialogActions({
  isSubmitting,
  submitLabel,
}: {
  isSubmitting: boolean
  submitLabel: string
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  )
}
