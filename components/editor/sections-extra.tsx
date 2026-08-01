"use client"

import {
  AddEntryButton,
  BulletsEditor,
  EntryCard,
  Field,
  TextField,
  TextareaField,
} from "@/components/editor/fields"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  createEmptyLeadership,
  createEmptyOtherGroup,
  createEmptyProject,
} from "@/lib/defaults"
import type { LeadershipEntry, OtherGroup, ProjectEntry } from "@/lib/types"

export function LeadershipSection({
  value,
  onChange,
}: {
  value: LeadershipEntry[]
  onChange: (next: LeadershipEntry[]) => void
}) {
  const updateEntry = (id: string, patch: Partial<LeadershipEntry>) =>
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))

  return (
    <div className="flex flex-col gap-2">
      {value.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.role || entry.organization}
          subtitle={entry.organization}
          onRemove={() => onChange(value.filter((item) => item.id !== entry.id))}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Organization"
              value={entry.organization}
              placeholder="Women in Tech"
              onChange={(organization) => updateEntry(entry.id, { organization })}
            />
            <TextField
              label="Role"
              value={entry.role}
              placeholder="Chapter Co-lead"
              onChange={(role) => updateEntry(entry.id, { role })}
            />
            <TextField
              label="Location"
              value={entry.location}
              placeholder="Remote · New York, NY"
              className="sm:col-span-2"
              onChange={(location) => updateEntry(entry.id, { location })}
            />
            <Field label="Start date">
              <Input
                type="month"
                value={entry.startDate}
                onChange={(event) => updateEntry(entry.id, { startDate: event.target.value })}
              />
            </Field>
            <div className="flex flex-col gap-1.5">
              <Field label="End date">
                <Input
                  type="month"
                  value={entry.current ? "" : entry.endDate}
                  disabled={entry.current}
                  onChange={(event) => updateEntry(entry.id, { endDate: event.target.value })}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none">
                <Checkbox
                  checked={entry.current}
                  onCheckedChange={(checked) => updateEntry(entry.id, { current: checked === true })}
                />
                Currently active
              </label>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs leading-none font-medium text-muted-foreground">
                Achievements
              </span>
              <BulletsEditor
                bullets={entry.bullets}
                onChange={(bullets) => updateEntry(entry.id, { bullets })}
              />
            </div>
          </div>
        </EntryCard>
      ))}
      <AddEntryButton
        label="Add leadership experience"
        onClick={() => onChange([...value, createEmptyLeadership()])}
      />
    </div>
  )
}

export function OtherSection({
  value,
  onChange,
}: {
  value: OtherGroup[]
  onChange: (next: OtherGroup[]) => void
}) {
  const updateGroup = (id: string, patch: Partial<OtherGroup>) =>
    onChange(value.map((group) => (group.id === id ? { ...group, ...patch } : group)))

  return (
    <div className="flex flex-col gap-2">
      {value.map((group) => (
        <EntryCard
          key={group.id}
          title={group.label || "Group"}
          onRemove={() => onChange(value.filter((item) => item.id !== group.id))}
        >
          <div className="flex flex-col gap-3">
            <TextField
              label="Group label"
              value={group.label}
              placeholder="Skills, Certifications, Languages, Links…"
              onChange={(label) => updateGroup(group.id, { label })}
            />
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs leading-none font-medium text-muted-foreground">
                Values
              </span>
              <BulletsEditor
                bullets={group.values}
                placeholder="e.g. TypeScript"
                onChange={(values) => updateGroup(group.id, { values })}
              />
            </div>
          </div>
        </EntryCard>
      ))}
      <AddEntryButton label="Add group" onClick={() => onChange([...value, createEmptyOtherGroup()])} />
    </div>
  )
}

export function ProjectsSection({
  value,
  onChange,
}: {
  value: ProjectEntry[]
  onChange: (next: ProjectEntry[]) => void
}) {
  const updateEntry = (id: string, patch: Partial<ProjectEntry>) =>
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))

  return (
    <div className="flex flex-col gap-2">
      {value.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.name}
          subtitle={entry.techStack}
          onRemove={() => onChange(value.filter((item) => item.id !== entry.id))}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Name"
              value={entry.name}
              placeholder="ResumeForge"
              onChange={(name) => updateEntry(entry.id, { name })}
            />
            <TextField
              label="Link"
              type="url"
              value={entry.link}
              placeholder="github.com/you/project"
              onChange={(link) => updateEntry(entry.id, { link })}
            />
            <TextField
              label="Tech stack"
              value={entry.techStack}
              placeholder="Next.js, Tailwind CSS, react-pdf"
              className="sm:col-span-2"
              onChange={(techStack) => updateEntry(entry.id, { techStack })}
            />
            <TextareaField
              label="Description (optional)"
              value={entry.description}
              rows={2}
              placeholder="Short description of the problem you solved…"
              className="sm:col-span-2"
              onChange={(description) => updateEntry(entry.id, { description })}
            />
            <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs leading-none font-medium text-muted-foreground">
                Highlights
              </span>
              <BulletsEditor
                bullets={entry.bullets}
                placeholder="What did you build and what was the impact?"
                onChange={(bullets) => updateEntry(entry.id, { bullets })}
              />
            </div>
          </div>
        </EntryCard>
      ))}
      <AddEntryButton label="Add project" onClick={() => onChange([...value, createEmptyProject()])} />
    </div>
  )
}
