export interface EditorProject {
  id: string
  name: string
  ownership: "owned" | "shared"
  role?: string
}
