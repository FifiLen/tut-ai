"use client"

import { FolderOpen, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "pointer-events-none absolute top-18 left-4 bottom-4 z-20 w-[22rem] transition-transform duration-300 ease-out",
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
            <EmptyProjectsState
              title="No projects yet"
              description="Create a workspace to start mapping your system."
            />
          </TabsContent>
          <TabsContent value="shared" className="mt-4 min-h-0 flex-1">
            <EmptyProjectsState
              title="Nothing shared yet"
              description="Shared projects will appear here when collaborators invite you."
            />
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
      </div>
    </aside>
  )
}

interface EmptyProjectsStateProps {
  title: string
  description: string
}

function EmptyProjectsState({
  title,
  description,
}: EmptyProjectsStateProps) {
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
