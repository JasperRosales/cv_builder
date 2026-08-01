"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ACCENTS, TEMPLATES } from "@/lib/constants"
import type { AccentId, ResumeState, TemplateId } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import {
  FileDown,
  FileJson2,
  FolderOpen,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  WandSparkles,
} from "lucide-react"

export interface ChecklistSummary {
  passed: number
  total: number
}

interface ToolbarProps {
  state: ResumeState
  checklist: ChecklistSummary
  onTemplateChange: (template: TemplateId) => void
  onAccentChange: (accent: AccentId) => void
  onExportJson: () => void
  onImportFile: (file: File) => void
  onReset: () => void
  onLoadSample: () => void
  onDownloadPdf: () => void
  onOpenChecklist: () => void
  pdfBusy: boolean
}

export function Toolbar({
  state,
  checklist,
  onTemplateChange,
  onAccentChange,
  onExportJson,
  onImportFile,
  onReset,
  onLoadSample,
  onDownloadPdf,
  onOpenChecklist,
  pdfBusy,
}: ToolbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    () => true,
    () => false
  )
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileJson2 className="size-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">CV Builder</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Private · runs in your browser
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <Select
              value={state.config.template}
              onValueChange={(value) => onTemplateChange(value as TemplateId)}
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className="flex h-8 items-center gap-1 rounded-lg border border-input bg-transparent px-2 dark:bg-input/30"
              role="group"
              aria-label="Accent color"
            >
              {ACCENTS.map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  title={accent.label}
                  aria-label={`Accent color ${accent.label}`}
                  className={cn(
                    "size-4 rounded-full ring-2 ring-offset-1 transition ring-offset-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    state.config.accent === accent.id
                      ? "ring-foreground"
                      : "ring-transparent hover:ring-foreground/40"
                  )}
                  style={{ backgroundColor: accent.color }}
                  onClick={() => onAccentChange(accent.id)}
                />
              ))}
            </div>

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" />} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                {mounted && (resolvedTheme === "dark" ? <Sun /> : <Moon />)}
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" className="relative" />} onClick={onOpenChecklist}>
                <ShieldCheck />
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                  {checklist.passed}/{checklist.total}
                </span>
              </TooltipTrigger>
              <TooltipContent>Resume quality checklist</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" />} onClick={() => fileInputRef.current?.click()}>
                <FolderOpen />
              </TooltipTrigger>
              <TooltipContent>Import resume (JSON)</TooltipContent>
            </Tooltip>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onImportFile(file)
                event.target.value = ""
              }}
            />

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" />} onClick={onExportJson}>
                <FileDown />
              </TooltipTrigger>
              <TooltipContent>Export resume as JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" />} onClick={onLoadSample}>
                <WandSparkles />
              </TooltipTrigger>
              <TooltipContent>Load sample resume</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Button size="icon-sm" variant="ghost" />} onClick={onReset}>
                <RotateCcw />
              </TooltipTrigger>
              <TooltipContent>New / reset resume</TooltipContent>
            </Tooltip>

            <Button size="sm" onClick={onDownloadPdf} disabled={pdfBusy} className="ml-1">
              <FileDown data-icon="inline-start" />
              {pdfBusy ? "Preparing…" : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
