import prisma from "@/lib/prisma"
import {
  jsonError,
  parseCreateProjectBody,
  projectSelect,
  requireAuthenticatedUser,
} from "@/lib/project-api"

export async function GET() {
  const authResult = await requireAuthenticatedUser()

  if (authResult instanceof Response) {
    return authResult
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: authResult.userId },
    orderBy: { createdAt: "desc" },
    select: projectSelect,
  })

  return Response.json({ data: { projects } })
}

export async function POST(request: Request) {
  const authResult = await requireAuthenticatedUser()

  if (authResult instanceof Response) {
    return authResult
  }

  const parsedBody = await parseCreateProjectBody(request)

  if (parsedBody instanceof Response) {
    return parsedBody
  }

  if (parsedBody.id) {
    const existingProject = await prisma.project.findUnique({
      where: { id: parsedBody.id },
      select: { id: true },
    })

    if (existingProject) {
      return jsonError("PROJECT_EXISTS", "Project ID already exists.", 409)
    }
  }

  const project = await prisma.$transaction(async (tx) => {
    const createdProject = await tx.project.create({
      data: {
        ...(parsedBody.id ? { id: parsedBody.id } : {}),
        ownerId: authResult.userId,
        name: parsedBody.name,
        canvasJsonPath: "",
      },
      select: projectSelect,
    })

    return tx.project.update({
      where: { id: createdProject.id },
      data: { canvasJsonPath: `canvas/${createdProject.id}.json` },
      select: projectSelect,
    })
  })

  return Response.json({ data: { project } }, { status: 201 })
}
