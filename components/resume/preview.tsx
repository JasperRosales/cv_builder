"use client"

import * as React from "react"

import { ACCENT_MAP, SECTIONS } from "@/lib/constants"
import { formatDateRange, joinNonEmpty } from "@/lib/format"
import type {
  EducationEntry,
  LeadershipEntry,
  OtherGroup,
  ProjectEntry,
  ResumeData,
  ResumeState,
  SectionKey,
  WorkEntry,
} from "@/lib/types"

const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1123

type Variant = "modern" | "classic"

function hasContent(key: SectionKey, data: ResumeData): boolean {
  switch (key) {
    case "summary":
      return data.summary.trim().length > 0
    case "work":
      return data.work.some((e) => e.company.trim() || e.position.trim())
    case "education":
      return data.education.some((e) => e.school.trim() || e.degree.trim())
    case "projects":
      return data.projects.some((e) => e.name.trim())
    case "leadership":
      return data.leadership.some((e) => e.organization.trim() || e.role.trim())
    case "other":
      return data.other.some((group) => group.values.some((value) => value.trim()))
    default:
      return true
  }
}

function SectionHeading({
  title,
  variant,
  accent,
}: {
  title: string
  variant: Variant
  accent: string
}) {
  if (variant === "classic") {
    return (
      <h2
        className="font-heading mb-2.5 pb-1 text-[13px] font-semibold tracking-[0.06em] uppercase"
        style={{ color: accent, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
      >
        {title}
      </h2>
    )
  }
  return (
    <h2
      className="mb-3 pb-1.5 text-[11px] font-bold tracking-[0.16em] uppercase"
      style={{ color: accent, borderBottom: `2px solid ${accent}` }}
    >
      {title}
    </h2>
  )
}

function ContactLine({ data, variant }: { data: ResumeData["personal"]; variant: Variant }) {
  const parts = [data.email, data.phone, data.location, data.website].filter((p) => p.trim())
  const text = parts.join(variant === "classic" ? "  |  " : "  ·  ")
  if (!text) return null
  return (
    <p className="mt-2 text-[12px]" style={{ color: "#4b5563" }}>
      {text}
    </p>
  )
}

function WorkEntries({ entries }: { entries: WorkEntry[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {entries.map((entry) => {
        const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
        const bullets = entry.bullets.filter((b) => b.trim())
        const left = (
          <div className="min-w-0 flex-1">
            <h3 className="text-[13.5px] leading-snug font-semibold" style={{ color: "#111827" }}>
              {entry.position || entry.company}
            </h3>
            <p className="text-[12px]" style={{ color: "#4b5563" }}>
              {joinNonEmpty([entry.company, entry.location], " · ")}
            </p>
          </div>
        )
        const right = range ? (
          <span className="shrink-0 text-[11px] whitespace-nowrap" style={{ color: "#6b7280" }}>
            {range}
          </span>
        ) : null
        return (
          <div key={entry.id}>
            <div className="flex items-baseline justify-between gap-3">
              {left}
              {right}
            </div>
            {bullets.length > 0 ? (
              <ul className="mt-1.5 space-y-0.5 pl-4 text-[12.5px] leading-relaxed text-justify list-disc" style={{ color: "#1f2937" }}>
                {bullets.map((bullet, index) => (
                  <li key={index} className="text-justify">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function EducationEntries({ entries }: { entries: EducationEntry[] }) {
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
        const title = joinNonEmpty([entry.degree, entry.fieldOfStudy], " · ")
        return (
          <div key={entry.id}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] leading-snug font-semibold" style={{ color: "#111827" }}>
                  {entry.school || title}
                </h3>
                {title ? (
                  <p className="text-[12px]" style={{ color: "#4b5563" }}>
                    {title}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                ) : null}
              </div>
              {range ? (
                <span className="shrink-0 text-[11px] whitespace-nowrap" style={{ color: "#6b7280" }}>
                  {range}
                </span>
              ) : null}
            </div>
            {entry.details.trim() ? (
              <p className="mt-1 text-[12px] leading-relaxed text-justify" style={{ color: "#374151" }}>
                {entry.details}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function LeadershipEntries({ entries }: { entries: LeadershipEntry[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {entries.map((entry) => {
        const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
        const bullets = entry.bullets.filter((b) => b.trim())
        return (
          <div key={entry.id}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-[13.5px] leading-snug font-semibold" style={{ color: "#111827" }}>
                  {entry.role || entry.organization}
                </h3>
                <p className="text-[12px]" style={{ color: "#4b5563" }}>
                  {joinNonEmpty([entry.organization, entry.location], " · ")}
                </p>
              </div>
              {range ? (
                <span className="shrink-0 text-[11px] whitespace-nowrap" style={{ color: "#6b7280" }}>
                  {range}
                </span>
              ) : null}
            </div>
            {bullets.length > 0 ? (
              <ul className="mt-1.5 space-y-0.5 pl-4 text-[12.5px] leading-relaxed text-justify list-disc" style={{ color: "#1f2937" }}>
                {bullets.map((bullet, index) => (
                  <li key={index} className="text-justify">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function OtherEntries({ groups }: { groups: OtherGroup[] }) {
  return (
    <div className="flex flex-col gap-1.5 text-[12.5px] leading-relaxed" style={{ color: "#1f2937" }}>
      {groups.map((group) => {
        const values = group.values.map((value) => value.trim()).filter(Boolean)
        if (values.length === 0) return null
        return (
          <p key={group.id}>
            {group.label.trim() ? (
              <span className="font-semibold" style={{ color: "#111827" }}>
                {group.label}:{" "}
              </span>
            ) : null}
            {values.join(", ")}
          </p>
        )
      })}
    </div>
  )
}

function ProjectEntries({ entries }: { entries: ProjectEntry[] }) {
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const bullets = entry.bullets.filter((b) => b.trim())
        return (
          <div key={entry.id}>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-[13px] font-semibold" style={{ color: "#111827" }}>
                {entry.name}
              </h3>
              {entry.link.trim() ? (
                <span className="text-[11px]" style={{ color: "#4b5563" }}>
                  {entry.link}
                </span>
              ) : null}
              {entry.techStack.trim() ? (
                <span className="text-[11px]" style={{ color: "#6b7280" }}>
                  {entry.techStack}
                </span>
              ) : null}
            </div>
            {entry.description.trim() ? (
              <p className="mt-0.5 text-[12px] leading-relaxed text-justify" style={{ color: "#374151" }}>
                {entry.description}
              </p>
            ) : null}
            {bullets.length > 0 ? (
              <ul className="mt-1 space-y-0.5 pl-4 text-[12px] leading-relaxed text-justify list-disc" style={{ color: "#1f2937" }}>
                {bullets.map((bullet, index) => (
                  <li key={index} className="text-justify">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function Template({ state }: { state: ResumeState }) {
  const data = state.data
  const variant = state.config.template as Variant
  const accent = ACCENT_MAP[state.config.accent]?.color ?? "#334155"

  const order = state.config.sectionOrder.filter(
    (key) => key !== "personal" && hasContent(key, data)
  )

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case "summary":
        return (
          <p className="text-[12.5px] leading-relaxed text-justify" style={{ color: "#1f2937" }}>
            {data.summary}
          </p>
        )
      case "work":
        return <WorkEntries entries={data.work} />
      case "education":
        return <EducationEntries entries={data.education} />
      case "projects":
        return <ProjectEntries entries={data.projects} />
      case "leadership":
        return <LeadershipEntries entries={data.leadership} />
      case "other":
        return <OtherEntries groups={data.other} />
      default:
        return null
    }
  }

  const header = (
    <header className="mb-6">
      <div className={variant === "classic" ? "" : "text-center"}>
        <h1
          className="text-[27px] leading-tight font-bold"
          style={{ color: "#111827", fontFamily: variant === "classic" ? "var(--font-heading)" : undefined }}
        >
          {data.personal.fullName}
        </h1>
        <p
          className="mt-1 text-[14px] font-medium"
          style={{ color: accent, fontFamily: variant === "classic" ? "var(--font-heading)" : undefined }}
        >
          {data.personal.jobTitle}
        </p>
        <div className={variant === "classic" ? "mt-1" : ""}>
          <ContactLine data={data.personal} variant={variant} />
        </div>
      </div>
    </header>
  )

  return (
    <div
      className="bg-white"
      style={{
        width: PAGE_WIDTH,
        minHeight: PAGE_HEIGHT,
        padding: "52px 60px",
        position: "relative",
        color: "#1f2937",
        fontFamily: variant === "classic" ? "var(--font-heading)" : "var(--font-sans)",
      }}
    >
      {header}
      {order.map((key) => (
        <section key={key} className="mb-5 last:mb-0">
          <SectionHeading title={titleFor(key)} variant={variant} accent={accent} />
          {renderSection(key)}
        </section>
      ))}
    </div>
  )
}

function titleFor(key: SectionKey): string {
  return SECTIONS[key].label
}

function ResumePreview({ state }: { state: ResumeState }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const pageRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0.5)
  const [pageHeight, setPageHeight] = React.useState(PAGE_HEIGHT)

  React.useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width
        setScale(Math.max(0.3, Math.min(1, (width - 48) / PAGE_WIDTH)))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  React.useLayoutEffect(() => {
    if (!pageRef.current) return
    const update = () => {
      if (pageRef.current) setPageHeight(pageRef.current.offsetHeight)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(pageRef.current)
    return () => observer.disconnect()
  }, [state])

  return (
    <div ref={containerRef} className="flex justify-center overflow-hidden px-4 py-6">
      <div style={{ width: PAGE_WIDTH * scale, height: pageHeight * scale }} className="relative shrink-0">
        <div
          ref={pageRef}
          className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-sm shadow-xl ring-1 ring-black/10"
          style={{ width: PAGE_WIDTH, transform: `scale(${scale})` }}
        >
          <Template state={state} />
        </div>
      </div>
    </div>
  )
}

export { ResumePreview }
