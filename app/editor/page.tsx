import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell"
import { getEditorProjects } from "@/lib/project-data"

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getEditorProjects()

  return (
    <EditorWorkspaceShell
      currentProjectId={null}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
