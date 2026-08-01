"use client"

import {
  AddEntryButton,
  BulletsEditor,
  EntryCard,
  Field,
  GridField,
  TextField,
  TextareaField,
} from "@/components/editor/fields"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { createEmptyEducation, createEmptyWork } from "@/lib/defaults"
import type {
  EducationEntry,
  PersonalInfo,
  WorkEntry,
} from "@/lib/types"

export function PersonalSection({
  value,
  onChange,
}: {
  value: PersonalInfo
  onChange: (next: PersonalInfo) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <TextField
        label="Full name"
        value={value.fullName}
        placeholder="Jane Doe"
        className="sm:col-span-2"
        onChange={(fullName) => onChange({ ...value, fullName })}
      />
      <TextField
        label="Job title"
        value={value.jobTitle}
        placeholder="Frontend Engineer"
        className="sm:col-span-2"
        onChange={(jobTitle) => onChange({ ...value, jobTitle })}
      />
      <TextField
        label="Email"
        type="email"
        value={value.email}
        placeholder="jane.doe@example.com"
        onChange={(email) => onChange({ ...value, email })}
      />
      <TextField
        label="Phone"
        type="tel"
        value={value.phone}
        placeholder="+1 (555) 000-0000"
        onChange={(phone) => onChange({ ...value, phone })}
      />
      <TextField
        label="Location"
        value={value.location}
        placeholder="San Francisco, CA"
        onChange={(location) => onChange({ ...value, location })}
      />
      <TextField
        label="Website"
        value={value.website}
        placeholder="janedoe.dev"
        onChange={(website) => onChange({ ...value, website })}
      />
    </div>
  )
}

export function SummarySection({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <TextareaField
        label="Professional summary"
        value={value}
        rows={5}
        placeholder="Frontend engineer with 8+ years of experience building fast, accessible web applications. Passionate about design systems and developer experience."
        onChange={onChange}
      />
      <div className="rounded-lg bg-muted/50 p-2.5 text-xs leading-relaxed text-muted-foreground">
        Keep it to 2–4 sentences. Mention your experience level, top skills, and what you
        bring to the role.
      </div>
    </div>
  )
}

export function WorkSection({
  value,
  onChange,
}: {
  value: WorkEntry[]
  onChange: (next: WorkEntry[]) => void
}) {
  const updateEntry = (id: string, patch: Partial<WorkEntry>) =>
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))

  return (
    <div className="flex flex-col gap-2">
      {value.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.position || entry.company}
          subtitle={entry.company}
          onRemove={() => onChange(value.filter((item) => item.id !== entry.id))}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Company"
              value={entry.company}
              placeholder="Acme Inc."
              onChange={(company) => updateEntry(entry.id, { company })}
            />
            <TextField
              label="Position"
              value={entry.position}
              placeholder="Senior Engineer"
              onChange={(position) => updateEntry(entry.id, { position })}
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
                Currently work here
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
        label="Add work experience"
        onClick={() => onChange([...value, createEmptyWork()])}
      />
    </div>
  )
}

export function EducationSection({
  value,
  onChange,
}: {
  value: EducationEntry[]
  onChange: (next: EducationEntry[]) => void
}) {
  const updateEntry = (id: string, patch: Partial<EducationEntry>) =>
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))

  return (
    <div className="flex flex-col gap-2">
      {value.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.degree ? `${entry.degree}${entry.fieldOfStudy ? `, ${entry.fieldOfStudy}` : ""}` : entry.school}
          subtitle={entry.school}
          onRemove={() => onChange(value.filter((item) => item.id !== entry.id))}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="School"
              value={entry.school}
              placeholder="University of Washington"
              className="sm:col-span-2"
              onChange={(school) => updateEntry(entry.id, { school })}
            />
            <TextField
              label="Degree"
              value={entry.degree}
              placeholder="B.S."
              onChange={(degree) => updateEntry(entry.id, { degree })}
            />
            <TextField
              label="Field of study"
              value={entry.fieldOfStudy}
              placeholder="Computer Science"
              onChange={(fieldOfStudy) => updateEntry(entry.id, { fieldOfStudy })}
            />
            <GridField
              label="Location"
              value={entry.location}
              placeholder="Seattle, WA"
              onChange={(location) => updateEntry(entry.id, { location })}
            />
            <Field label="Start date">
              <Input
                type="month"
                value={entry.startDate}
                onChange={(event) => updateEntry(entry.id, { startDate: event.target.value })}
              />
            </Field>
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
              Currently enrolled
            </label>
            <TextareaField
              label="Details (optional)"
              value={entry.details}
              placeholder="Relevant coursework, GPA, honors, thesis…"
              className="sm:col-span-2"
              onChange={(details) => updateEntry(entry.id, { details })}
            />
          </div>
        </EntryCard>
      ))}
      <AddEntryButton
        label="Add education"
        onClick={() => onChange([...value, createEmptyEducation()])}
      />
    </div>
  )
}
