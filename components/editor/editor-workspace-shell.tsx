"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorWorkspaceShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <main className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
          <div className="flex h-full min-h-[24rem] w-full items-center justify-center rounded-[2rem] border border-dashed border-surface-border bg-surface/40 text-sm text-copy-muted">
            Editor canvas placeholder
          </div>
        </div>
      </main>
    </div>
  )
}
