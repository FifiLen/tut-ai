"use client"

import { FolderOpen, Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { EditorProject } from "@/types/project"

interface ProjectSidebarProps {
  currentProjectId: string | null
  isOpen: boolean
  onClose?: () => void
  onCreateProject: () => void
  onDeleteProject: (projectId: string) => void
  onRenameProject: (projectId: string) => void
  onSelectProject: (projectId: string) => void
  ownedProjects: EditorProject[]
  sharedProjects: EditorProject[]
}

export function ProjectSidebar({
  currentProjectId,
  isOpen,
  onClose,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  onSelectProject,
  ownedProjects,
  sharedProjects,
}: ProjectSidebarProps) {
  return (
    <>
      <button
        type="button"
        className={cn(
          "absolute inset-0 z-10 bg-black/45 transition-opacity duration-300 md:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-label="Close projects sidebar"
      />
      <aside
        className={cn(
          "pointer-events-none absolute top-18 left-4 bottom-4 z-20 w-[min(22rem,calc(100%-2rem))] transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        )}
        aria-hidden={!isOpen}
      >
        <div className="pointer-events-auto flex h-full flex-col rounded-2xl border border-surface-border bg-sidebar text-sidebar-foreground shadow-2xl supports-backdrop-filter:backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-copy-primary">
                Projects
              </h2>
              <p className="text-xs text-copy-muted">
                Open or create a workspace.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close projects sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs
            defaultValue="my-projects"
            className="flex min-h-0 flex-1 flex-col px-4 py-4"
          >
            <TabsList className="w-full bg-subtle">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-4 min-h-0 flex-1">
              <ProjectList
                currentProjectId={currentProjectId}
                emptyDescription="Create a workspace to start mapping your system."
                emptyTitle="No projects yet"
                onDeleteProject={onDeleteProject}
                onRenameProject={onRenameProject}
                onSelectProject={onSelectProject}
                projects={ownedProjects}
              />
            </TabsContent>

            <TabsContent value="shared" className="mt-4 min-h-0 flex-1">
              <ProjectList
                currentProjectId={currentProjectId}
                emptyDescription="Shared projects will appear here when collaborators invite you."
                emptyTitle="Nothing shared yet"
                onDeleteProject={onDeleteProject}
                onRenameProject={onRenameProject}
                onSelectProject={onSelectProject}
                projects={sharedProjects}
              />
            </TabsContent>
          </Tabs>

          <div className="border-t border-surface-border p-4">
            <Button className="w-full" onClick={onCreateProject}>
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

interface ProjectListProps {
  currentProjectId: string | null
  emptyDescription: string
  emptyTitle: string
  onDeleteProject: (projectId: string) => void
  onRenameProject: (projectId: string) => void
  onSelectProject: (projectId: string) => void
  projects: EditorProject[]
}

function ProjectList({
  currentProjectId,
  emptyDescription,
  emptyTitle,
  onDeleteProject,
  onRenameProject,
  onSelectProject,
  projects,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyProjectsState title={emptyTitle} description={emptyDescription} />
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-3">
        {projects.map((project) => {
          const isOwned = project.ownership === "owned"
          const isCurrentProject = currentProjectId === project.id

          return (
            <div
              key={project.id}
              className={cn(
                "group rounded-2xl border border-surface-border bg-surface/60 px-3 py-3 transition-colors",
                isCurrentProject && "border-brand/40 bg-accent-dim",
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-copy-faint" />
                    <p className="truncate text-sm font-medium text-copy-primary">
                      {project.name}
                    </p>
                  </div>
                  <p className="mt-2 truncate text-xs text-copy-muted">
                    /editor/{project.id}
                  </p>
                  {project.role ? (
                    <p className="mt-1 text-xs text-copy-faint">{project.role}</p>
                  ) : null}
                </button>
                {isOwned ? (
                  <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onRenameProject(project.id)}
                      aria-label={`Rename ${project.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDeleteProject(project.id)}
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

interface EmptyProjectsStateProps {
  description: string
  title: string
}

function EmptyProjectsState({ title, description }: EmptyProjectsStateProps) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-surface/60 px-6 text-center">
      <div className="mb-4 rounded-2xl border border-surface-border bg-elevated p-3 text-copy-secondary">
        <FolderOpen className="h-8 w-8" />
      </div>
      <h3 className="text-sm font-medium text-copy-primary">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-copy-muted">{description}</p>
    </div>
  )
}
