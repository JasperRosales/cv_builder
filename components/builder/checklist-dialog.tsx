"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { countPassed, runChecks } from "@/lib/checklist"
import type { ResumeState } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertTriangle, CircleCheck, CircleX, Sparkles } from "lucide-react"

function CheckIcon({ pass }: { pass: boolean }) {
  return pass ? (
    <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
  ) : (
    <CircleX className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
  )
}

export function ChecklistDialog({
  state,
  open,
  onOpenChange,
}: {
  state: ResumeState
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const checks = React.useMemo(() => runChecks(state), [state])
  const passed = countPassed(checks)
  const total = checks.length
  const pct = total === 0 ? 0 : Math.round((passed / total) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90svh,640px)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume quality checklist</DialogTitle>
          <DialogDescription>
            ATS-friendly tips to help your resume get past applicant tracking systems.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-3",
            pct === 100
              ? "bg-emerald-500/10 text-emerald-600"
              : pct >= 60
                ? "bg-amber-500/10 text-amber-600"
                : "bg-destructive/10 text-destructive"
          )}
        >
          {pct === 100 ? (
            <CircleCheck className="size-5" />
          ) : (
            <AlertTriangle className="size-5" />
          )}
          <div className="flex-1 text-sm font-medium">
            {passed} of {total} checks passed ({pct}%)
          </div>
          {pct === 100 ? (
            <Sparkles className="size-4 opacity-70" />
          ) : null}
        </div>

        <ul className="flex flex-col gap-1">
          {checks.map((check) => (
            <li
              key={check.id}
              className={cn(
                "flex items-start gap-2.5 rounded-md px-2 py-1.5 text-sm",
                check.pass ? "text-foreground" : "bg-muted/40"
              )}
            >
              <CheckIcon pass={check.pass} />
              <div className="min-w-0">
                <p
                  className={cn(
                    "leading-snug",
                    !check.pass && "font-medium"
                  )}
                >
                  {check.label}
                </p>
                {!check.pass && check.hint ? (
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {check.hint}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-2">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
