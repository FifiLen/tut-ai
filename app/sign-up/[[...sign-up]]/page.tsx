import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"
import { clerkSignUpPath } from "@/lib/clerk"

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your workspace and start designing immediately."
      description="Set up your account to capture decisions, iterate with AI, and keep the full project flow in one place."
    >
      <SignUp path={clerkSignUpPath} />
    </AuthShell>
  )
}
