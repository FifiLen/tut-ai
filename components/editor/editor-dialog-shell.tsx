import type { ReactNode } from "react"

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface EditorDialogShellProps {
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

export function EditorDialogShell({
  title,
  description,
  children,
  footer,
  className,
}: EditorDialogShellProps) {
  return (
    <DialogContent
      className={cn(
        "max-w-xl rounded-3xl border border-surface-border bg-elevated p-0 text-copy-primary shadow-2xl ring-0",
        className,
      )}
    >
      <DialogHeader className="gap-2 px-6 pt-6">
        <DialogTitle className="text-lg text-copy-primary">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="text-copy-secondary">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>
      {children ? <div className="px-6 py-5">{children}</div> : null}
      {footer ? (
        <DialogFooter className="rounded-b-3xl border-surface-border bg-subtle/80 px-6 py-4">
          {footer}
        </DialogFooter>
      ) : null}
    </DialogContent>
  )
}
