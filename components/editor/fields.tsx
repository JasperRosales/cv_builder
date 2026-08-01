"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs leading-none font-medium text-muted-foreground select-none"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-[0.7rem] leading-tight text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  type?: string
}) {
  const id = React.useId()
  return (
    <Field label={label} htmlFor={id} className={className}>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className={inputClassName}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  className,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
}) {
  const id = React.useId()
  return (
    <Field label={label} htmlFor={id} className={className}>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

function GridField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const id = React.useId()
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

function BulletsEditor({
  bullets,
  onChange,
  placeholder = "Achieved X, resulting in Y",
  max = 10,
}: {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
  max?: number
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-start gap-1.5">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
          <Input
            value={bullet}
            placeholder={placeholder}
            className="flex-1"
            onChange={(event) =>
              onChange(bullets.map((item, i) => (i === index ? event.target.value : item)))
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Remove bullet"
            onClick={() => onChange(bullets.filter((_, i) => i !== index))}
          >
            <XIcon />
          </Button>
        </div>
      ))}
      {bullets.length < max ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-fit text-muted-foreground"
          onClick={() => onChange([...bullets, ""])}
        >
          <PlusIcon data-icon="inline-start" />
          Add bullet
        </Button>
      ) : null}
    </div>
  )
}

function EntryCard({
  title,
  subtitle,
  defaultOpen,
  onRemove,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  onRemove: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? title.trim().length === 0)

  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
      <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/40 px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={open ? "Collapse entry" : "Expand entry"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title || "Untitled"}</p>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Remove entry"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </div>
      {open ? <div className="grid gap-3 p-3">{children}</div> : null}
    </div>
  )
}

function AddEntryButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-full text-muted-foreground"
      onClick={onClick}
    >
      <PlusIcon data-icon="inline-start" />
      {label}
    </Button>
  )
}

function DragHandle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder section"
      className={cn(
        "inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground/70 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing",
        className
      )}
      {...props}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  )
}

export {
  AddEntryButton,
  BulletsEditor,
  DragHandle,
  EntryCard,
  Field,
  GridField,
  TextField,
  TextareaField,
}
