import "server-only"

import { currentUser } from "@clerk/nextjs/server"

import prisma from "@/lib/prisma"
import type { EditorProject } from "@/types/project"

interface EditorProjectsResult {
  ownedProjects: EditorProject[]
  sharedProjects: EditorProject[]
}

export async function getEditorProjects(): Promise<EditorProjectsResult> {
  const user = await currentUser()

  if (!user) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    }
  }

  const userEmail = user.primaryEmailAddress?.emailAddress.toLowerCase()

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    userEmail
      ? prisma.project.findMany({
          where: {
            ownerId: { not: user.id },
            collaborators: {
              some: {
                email: userEmail,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ])

  return {
    ownedProjects: ownedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownership: "owned",
    })),
    sharedProjects: sharedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownership: "shared",
      role: "Can edit",
    })),
  }
}
