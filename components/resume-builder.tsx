"use client"

import * as React from "react"

import { ChecklistDialog } from "@/components/builder/checklist-dialog"
import { Toolbar, type ChecklistSummary } from "@/components/builder/toolbar"
import {
  LeadershipSection,
  OtherSection,
  ProjectsSection,
} from "@/components/editor/sections-extra"
import {
  EducationSection,
  PersonalSection,
  SummarySection,
  WorkSection,
} from "@/components/editor/sections-core"
import { DragHandle } from "@/components/editor/fields"
import { ResumePreview } from "@/components/resume/preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SECTIONS } from "@/lib/constants"
import { countPassed, runChecks } from "@/lib/checklist"
import { downloadJson, deserializeResume } from "@/lib/storage"
import { createSampleResume } from "@/lib/defaults"
import {
  getResumeServerSnapshot,
  getResumeSnapshot,
  initResumeStore,
  replaceResume,
  resetResume,
  subscribeResume,
  updateResume,
} from "@/lib/resume-store"
import { exportResumeAsPdf } from "@/lib/pdf"
import type {
  AccentId,
  ResumeData,
  ResumeState,
  SectionKey,
  TemplateId,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react"

const NON_DRAGGABLE: SectionKey[] = ["personal"]

function SectionCard({
  sectionKey,
  collapsed,
  onToggleCollapse,
  dragState,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  locked,
  children,
}: {
  sectionKey: SectionKey
  collapsed: boolean
  onToggleCollapse: () => void
  dragState: { from: SectionKey | null; over: SectionKey | null }
  onDragStart: (key: SectionKey) => (event: React.DragEvent) => void
  onDragOver: (key: SectionKey) => (event: React.DragEvent) => void
  onDragLeave: (key: SectionKey) => (event: React.DragEvent) => void
  onDrop: (key: SectionKey) => (event: React.DragEvent) => void
  onDragEnd: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  locked: boolean
  children: React.ReactNode
}) {
  const meta = SECTIONS[sectionKey]
  const isDragging = dragState.from === sectionKey
  const isOver = dragState.from !== null && dragState.over === sectionKey

  return (
    <div
      data-slot="section-card"
      className={cn(
        "overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-colors",
        isOver && "border-t-2 border-t-primary",
        isDragging && "opacity-40"
      )}
      onDragOver={onDragOver(sectionKey)}
      onDragLeave={onDragLeave(sectionKey)}
      onDrop={onDrop(sectionKey)}
    >
      <div className="flex items-center gap-1 p-2">
        {!locked ? (
          <DragHandle
            draggable
            onDragStart={onDragStart(sectionKey)}
            onDragEnd={onDragEnd}
          />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center">
            <CheckIcon className="size-4 text-muted-foreground/60" />
          </span>
        )}
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-0.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{meta.label}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {meta.description}
            </span>
          </span>
        </button>
        {!locked ? (
          <div className="flex shrink-0 items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Move section up"
              disabled={!canMoveUp}
              onClick={onMoveUp}
            >
              <ChevronUpIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Move section down"
              disabled={!canMoveDown}
              onClick={onMoveDown}
            >
              <ChevronDownIcon />
            </Button>
          </div>
        ) : null}
      </div>
      {!collapsed ? <div className="border-t p-3">{children}</div> : null}
    </div>
  )
}

export function ResumeBuilder() {
  const state = React.useSyncExternalStore(
    subscribeResume,
    getResumeSnapshot,
    getResumeServerSnapshot
  )
  const [collapsed, setCollapsed] = React.useState<Set<SectionKey>>(new Set())
  const [checklistOpen, setChecklistOpen] = React.useState(false)
  const [resetOpen, setResetOpen] = React.useState(false)
  const [pdfBusy, setPdfBusy] = React.useState(false)
  const [message, setMessage] = React.useState<{
    kind: "success" | "error"
    text: string
  } | null>(null)
  const [dragState, setDragState] = React.useState<{
    from: SectionKey | null
    over: SectionKey | null
  }>({ from: null, over: null })

  React.useEffect(() => {
    initResumeStore()
  }, [])

  React.useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [message])

  const updateData = (updater: (data: ResumeData) => ResumeData) =>
    updateResume((prev) => ({ ...prev, data: updater(prev.data) }))

  const updateConfig = (updater: (config: ResumeState["config"]) => ResumeState["config"]) =>
    updateResume((prev) => ({ ...prev, config: updater(prev.config) }))

  const checklistSummary: ChecklistSummary = React.useMemo(() => {
    const checks = runChecks(state)
    return { passed: countPassed(checks), total: checks.length }
  }, [state])

  const reorderSections = (fromKey: SectionKey, toKey: SectionKey) => {
    if (fromKey === toKey) return
    updateResume((prev) => {
      const order = prev.config.sectionOrder
      const list = order.filter((key) => !NON_DRAGGABLE.includes(key))
      const fromIdx = list.indexOf(fromKey)
      const toIdx = list.indexOf(toKey)
      if (fromIdx < 0 || toIdx < 0) return prev
      const next = [...list]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return { ...prev, config: { ...prev.config, sectionOrder: ["personal", ...next] } }
    })
  }

  const shiftSection = (key: SectionKey, direction: -1 | 1) => {
    updateResume((prev) => {
      const list = prev.config.sectionOrder.filter((item) => !NON_DRAGGABLE.includes(item))
      const index = list.indexOf(key)
      const target = index + direction
      if (index < 0 || target < 0 || target >= list.length) return prev
      const next = [...list]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return { ...prev, config: { ...prev.config, sectionOrder: ["personal", ...next] } }
    })
  }

  const toggleCollapse = (key: SectionKey) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const showMessage = (text: string, kind: "success" | "error" = "success") =>
    setMessage({ text, kind })

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const imported = deserializeResume(text)
      replaceResume(imported)
      showMessage("Resume imported")
    } catch {
      showMessage("Invalid resume file", "error")
    }
  }

  const handleReset = () => {
    resetResume()
    setResetOpen(false)
    showMessage("Started a new resume")
  }

  const handleLoadSample = () => {
    replaceResume(createSampleResume())
    setResetOpen(false)
    showMessage("Sample resume loaded")
  }

  const handleDownloadPdf = async () => {
    setPdfBusy(true)
    try {
      await exportResumeAsPdf(state)
    } catch (error) {
      console.error(error)
      showMessage("PDF export failed", "error")
    } finally {
      setPdfBusy(false)
    }
  }

  const renderEditor = (key: SectionKey) => {
    switch (key) {
      case "personal":
        return (
          <PersonalSection
            value={state.data.personal}
            onChange={(next) => updateData((data) => ({ ...data, personal: next }))}
          />
        )
      case "summary":
        return (
          <SummarySection
            value={state.data.summary}
            onChange={(next) => updateData((data) => ({ ...data, summary: next }))}
          />
        )
      case "work":
        return (
          <WorkSection
            value={state.data.work}
            onChange={(next) => updateData((data) => ({ ...data, work: next }))}
          />
        )
      case "education":
        return (
          <EducationSection
            value={state.data.education}
            onChange={(next) => updateData((data) => ({ ...data, education: next }))}
          />
        )
      case "projects":
        return (
          <ProjectsSection
            value={state.data.projects}
            onChange={(next) => updateData((data) => ({ ...data, projects: next }))}
          />
        )
      case "leadership":
        return (
          <LeadershipSection
            value={state.data.leadership}
            onChange={(next) => updateData((data) => ({ ...data, leadership: next }))}
          />
        )
      case "other":
        return (
          <OtherSection
            value={state.data.other}
            onChange={(next) => updateData((data) => ({ ...data, other: next }))}
          />
        )
      default:
        return null
    }
  }

  const renderSectionCard = (key: SectionKey, index: number, total: number) => (
    <SectionCard
      key={key}
      sectionKey={key}
      collapsed={collapsed.has(key)}
      onToggleCollapse={() => toggleCollapse(key)}
      dragState={dragState}
      locked={NON_DRAGGABLE.includes(key)}
      canMoveUp={!NON_DRAGGABLE.includes(key) && index > 0}
      canMoveDown={!NON_DRAGGABLE.includes(key) && index < total - 1}
      onMoveUp={() => shiftSection(key, -1)}
      onMoveDown={() => shiftSection(key, 1)}
      onDragStart={(fromKey) => (event) => {
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", fromKey)
        setDragState({ from: fromKey, over: null })
      }}
      onDragOver={(overKey) => (event) => {
        if (dragState.from === null || dragState.from === overKey) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
        setDragState((prev) => (prev.over === overKey ? prev : { ...prev, over: overKey }))
      }}
      onDragLeave={() => (event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return
        setDragState((prev) => ({ ...prev, over: null }))
      }}
      onDrop={(toKey) => (event) => {
        event.preventDefault()
        const fromKey = event.dataTransfer.getData("text/plain") as SectionKey
        if (fromKey) reorderSections(fromKey, toKey)
        setDragState({ from: null, over: null })
      }}
      onDragEnd={() => setDragState({ from: null, over: null })}
    >
      {renderEditor(key)}
    </SectionCard>
  )

  const orderedKeys = state.config.sectionOrder
  const draggableKeys = orderedKeys.filter((key) => !NON_DRAGGABLE.includes(key))

  return (
    <div className="min-h-svh bg-muted/40">
      <Toolbar
        state={state}
        checklist={checklistSummary}
        onTemplateChange={(template: TemplateId) =>
          updateConfig((config) => ({ ...config, template }))
        }
        onAccentChange={(accent: AccentId) =>
          updateConfig((config) => ({ ...config, accent }))
        }
        onExportJson={() => {
          downloadJson(state)
          showMessage("Resume exported as JSON")
        }}
        onImportFile={handleImportFile}
        onReset={() => setResetOpen(true)}
        onLoadSample={handleLoadSample}
        onDownloadPdf={handleDownloadPdf}
        onOpenChecklist={() => setChecklistOpen(true)}
        pdfBusy={pdfBusy}
      />

      <div className="mx-auto grid w-full max-w-[1560px] gap-5 p-4 lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col gap-2.5">
          {orderedKeys.map((key) => {
            if (NON_DRAGGABLE.includes(key)) {
              return renderSectionCard(key, 0, draggableKeys.length)
            }
            const draggableIndex = draggableKeys.indexOf(key)
            return renderSectionCard(key, draggableIndex, draggableKeys.length)
          })}
        </aside>

        <main className="min-w-0 rounded-xl bg-muted/20 ring-1 ring-foreground/10 lg:sticky lg:top-16 lg:max-h-[calc(100svh-5rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
            <span>Live preview</span>
            <span>
              {TEMPLATE_LABELS[state.config.template]} ·{" "}
              {state.config.sectionOrder.filter((key) => key !== "personal").length + 1}{" "}
              sections
            </span>
          </div>
          <ResumePreview state={state} />
        </main>
      </div>

      <ChecklistDialog
        state={state}
        open={checklistOpen}
        onOpenChange={setChecklistOpen}
      />

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start fresh?</DialogTitle>
            <DialogDescription>
              You can either reset the current resume or load a sample to explore. Changes
              will replace what is stored in this browser.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleLoadSample}>
              Load sample
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {message ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div
            role="status"
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm shadow-lg ring-1 ring-black/10",
              message.kind === "success"
                ? "bg-foreground text-background"
                : "bg-destructive text-destructive-foreground"
            )}
          >
            {message.text}
          </div>
        </div>
      ) : null}
    </div>
  )
}

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  modern: "Modern",
  classic: "Classic",
  minimal: "Minimal",
}
