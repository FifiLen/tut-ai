import type { ReactNode } from "react"

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
}

const productHighlights = [
  "Structured editor workspace for multi-step system design.",
  "Persistent collaboration context that keeps decisions aligned.",
  "Focused AI-assisted drafting without leaving the workspace.",
]

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen bg-base">
      <section className="hidden flex-1 border-r border-surface-border lg:flex">
        <div className="flex w-full max-w-xl flex-col justify-between px-10 py-12 xl:px-14">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-copy-secondary">
              Ghost AI
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-copy-muted">
                System design workspace
              </p>
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-copy-primary">
                {title}
              </h1>
              <p className="max-w-md text-base leading-7 text-copy-secondary">
                {description}
              </p>
            </div>
          </div>
          <ul className="space-y-4">
            {productHighlights.map((item) => (
              <li
                key={item}
                className="border-t border-surface-border pt-4 text-sm leading-6 text-copy-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}
