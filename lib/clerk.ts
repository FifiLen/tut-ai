import type { ComponentProps } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/ui/themes"

const DEFAULT_SIGN_IN_PATH = "/sign-in"
const DEFAULT_SIGN_UP_PATH = "/sign-up"

function normalizeClerkPath(value: string | undefined, fallback: string) {
  if (!value) {
    return fallback
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).pathname || fallback
    } catch {
      return fallback
    }
  }

  return value.startsWith("/") ? value : `/${value}`
}

export const clerkSignInPath = normalizeClerkPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? process.env.CLERK_SIGN_IN_URL,
  DEFAULT_SIGN_IN_PATH,
)

export const clerkSignUpPath = normalizeClerkPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? process.env.CLERK_SIGN_UP_URL,
  DEFAULT_SIGN_UP_PATH,
)

export const clerkPublicRouteMatchers = [
  clerkSignInPath,
  `${clerkSignInPath}(.*)`,
  clerkSignUpPath,
  `${clerkSignUpPath}(.*)`,
]

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorBackground: "var(--bg-surface)",
    colorBorder: "var(--border-default)",
    colorDanger: "var(--state-error)",
    colorForeground: "var(--text-primary)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorNeutral: "var(--text-primary)",
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorRing: "var(--accent-primary)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
  },
} satisfies ComponentProps<typeof ClerkProvider>["appearance"]
