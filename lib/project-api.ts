import { auth } from "@clerk/nextjs/server"

import type { Project } from "@/app/generated/prisma/client"

export const DEFAULT_PROJECT_NAME = "Untitled Project"

export const projectSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof Project, true>

interface ApiError {
  code: string
  message: string
}

interface AuthenticatedUser {
  userId: string
}

interface ProjectNameResult {
  id?: string
  name: string
}

interface ProjectRenameResult {
  name: string
}

export async function requireAuthenticatedUser(): Promise<
  AuthenticatedUser | Response
> {
  const { userId } = await auth()

  if (!userId) {
    return jsonError("UNAUTHORIZED", "Authentication is required.", 401)
  }

  return { userId }
}

export function jsonError(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } satisfies ApiError }, { status })
}

export async function parseCreateProjectBody(
  request: Request,
): Promise<ProjectNameResult | Response> {
  const body = await parseJsonObject(request)

  if (body instanceof Response) {
    return body
  }

  const parsedId = parseProjectId(body.id)

  if (parsedId instanceof Response) {
    return parsedId
  }

  if (!("name" in body) || body.name == null) {
    return { id: parsedId, name: DEFAULT_PROJECT_NAME }
  }

  if (typeof body.name !== "string") {
    return jsonError("INVALID_REQUEST", "Project name must be a string.", 400)
  }

  const name = body.name.trim()

  return { id: parsedId, name: name || DEFAULT_PROJECT_NAME }
}

export async function parseRenameProjectBody(
  request: Request,
): Promise<ProjectRenameResult | Response> {
  const body = await parseJsonObject(request)

  if (body instanceof Response) {
    return body
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return jsonError("INVALID_REQUEST", "Project name is required.", 400)
  }

  return { name: body.name.trim() }
}

async function parseJsonObject(
  request: Request,
): Promise<Record<string, unknown> | Response> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return jsonError("INVALID_JSON", "Request body must be valid JSON.", 400)
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("INVALID_REQUEST", "Request body must be a JSON object.", 400)
  }

  return body as Record<string, unknown>
}

function parseProjectId(value: unknown) {
  if (value == null) {
    return undefined
  }

  if (typeof value !== "string") {
    return jsonError("INVALID_REQUEST", "Project ID must be a string.", 400)
  }

  const id = value.trim()

  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(id)) {
    return jsonError(
      "INVALID_REQUEST",
      "Project ID must be 3-64 lowercase letters, numbers, or hyphens.",
      400,
    )
  }

  return id
}
