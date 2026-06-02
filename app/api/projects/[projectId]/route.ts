import prisma from "@/lib/prisma"
import {
  jsonError,
  parseRenameProjectBody,
  projectSelect,
  requireAuthenticatedUser,
} from "@/lib/project-api"

interface ProjectRouteContext {
  params: Promise<{
    projectId: string
  }>
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const authResult = await requireAuthenticatedUser()

  if (authResult instanceof Response) {
    return authResult
  }

  const parsedBody = await parseRenameProjectBody(request)

  if (parsedBody instanceof Response) {
    return parsedBody
  }

  const { projectId } = await context.params
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!existingProject) {
    return jsonError("NOT_FOUND", "Project was not found.", 404)
  }

  if (existingProject.ownerId !== authResult.userId) {
    return jsonError("FORBIDDEN", "Only the project owner can rename it.", 403)
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: parsedBody.name },
    select: projectSelect,
  })

  return Response.json({ data: { project } })
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  const authResult = await requireAuthenticatedUser()

  if (authResult instanceof Response) {
    return authResult
  }

  const { projectId } = await context.params
  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!existingProject) {
    return jsonError("NOT_FOUND", "Project was not found.", 404)
  }

  if (existingProject.ownerId !== authResult.userId) {
    return jsonError("FORBIDDEN", "Only the project owner can delete it.", 403)
  }

  await prisma.project.delete({
    where: { id: projectId },
  })

  return new Response(null, { status: 204 })
}
