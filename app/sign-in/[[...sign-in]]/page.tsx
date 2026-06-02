import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { clerkSignInPath } from "@/lib/clerk"

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to continue your current design session."
      description="Access your editor, project context, and previous iterations from one secure workspace."
    >
      <SignIn path={clerkSignInPath} />
    </AuthShell>
  )
}
