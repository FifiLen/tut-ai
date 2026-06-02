import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell"
import { getEditorProjects } from "@/lib/project-data"

interface EditorProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function EditorProjectPage({
  params,
}: EditorProjectPageProps) {
  const [{ projectId }, { ownedProjects, sharedProjects }] = await Promise.all([
    params,
    getEditorProjects(),
  ])

  return (
    <EditorWorkspaceShell
      currentProjectId={projectId}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
