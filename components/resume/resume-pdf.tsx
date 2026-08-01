"use client"

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import { ACCENT_MAP } from "@/lib/constants"
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

type Variant = "modern" | "classic" | "minimal"

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

const TITLES: Record<SectionKey, string> = {
  personal: "Personal Details",
  summary: "Professional Summary",
  work: "Work Experience",
  education: "Education",
  projects: "Projects",
  leadership: "Leadership",
  other: "Other",
}

function createStyles(variant: Variant, accent: string) {
  const serif = variant === "classic"
  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      lineHeight: 1.4,
      color: "#1f2937",
      fontFamily: serif ? "Times-Roman" : "Helvetica",
    },
    accentBar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      backgroundColor: accent,
    },
    header: {
      marginBottom: 18,
      ...(variant === "minimal"
        ? { flexDirection: "row", justifyContent: "space-between" }
        : { alignItems: "center", textAlign: "center" }),
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#111827",
      fontFamily: serif ? "Times-Roman" : "Helvetica",
    },
    title: {
      marginTop: 2,
      fontSize: 12.5,
      fontWeight: "medium",
      color: accent,
      fontFamily: serif ? "Times-Roman" : "Helvetica",
    },
    contact: {
      marginTop: 6,
      fontSize: 8.5,
      color: "#4b5563",
    },
    contactRight: {
      fontSize: 8.5,
      color: "#4b5563",
      textAlign: "right",
      maxWidth: 240,
    },
    section: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 9.5,
      fontWeight: "bold",
      color: accent,
      textTransform: "uppercase",
      letterSpacing: 1.1,
      marginBottom: 6,
      ...(variant === "minimal"
        ? {}
        : {
            borderBottomWidth: variant === "modern" ? 1.5 : 0.6,
            borderBottomColor: variant === "modern" ? accent : "#cbd5e1",
            paddingBottom: 3,
          }),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    entryTitle: {
      fontSize: 10.5,
      fontWeight: "bold",
      color: "#111827",
    },
    entrySub: {
      fontSize: 9.2,
      color: "#4b5563",
      marginTop: 1,
    },
    dates: {
      fontSize: 8.5,
      color: "#6b7280",
    },
    bullets: {
      marginTop: 3,
    },
    bullet: {
      fontSize: 9.5,
      color: "#1f2937",
      marginBottom: 1.5,
      textAlign: "justify",
    },
    paragraph: {
      fontSize: 9.5,
      color: "#1f2937",
      textAlign: "justify",
    },
    otherRow: {
      fontSize: 9.5,
      color: "#1f2937",
      marginBottom: 2,
    },
    otherLabel: {
      fontWeight: "bold",
      color: "#111827",
    },
  })
}

function SectionTitle({
  title,
  styles,
}: {
  title: string
  styles: ReturnType<typeof createStyles>
}) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

export function ResumePdf({ state }: { state: ResumeState }) {
  const data = state.data
  const variant = state.config.template as Variant
  const accent = ACCENT_MAP[state.config.accent]?.color ?? "#334155"
  const styles = createStyles(variant, accent)

  const order = state.config.sectionOrder.filter(
    (key) => key !== "personal" && hasContent(key, data)
  )

  const contactParts = joinNonEmpty(
    [data.personal.email, data.personal.phone, data.personal.location, data.personal.website],
    variant === "classic" ? "  |  " : "  ·  "
  )

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case "summary":
        return <Text style={styles.paragraph}>{data.summary}</Text>
      case "work":
        return renderWork(data.work)
      case "education":
        return renderEducation(data.education)
      case "projects":
        return renderProjects(data.projects)
      case "leadership":
        return renderLeadership(data.leadership)
      case "other":
        return renderOther(data.other)
      default:
        return null
    }
  }

  const renderWork = (entries: WorkEntry[]) =>
    entries.map((entry) => {
      const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
      const bullets = entry.bullets.filter((b) => b.trim())
      return (
        <View key={entry.id} style={{ marginBottom: 9 }} wrap={false}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.entryTitle}>{entry.position || entry.company}</Text>
              <Text style={styles.entrySub}>
                {joinNonEmpty([entry.company, entry.location], " · ")}
              </Text>
            </View>
            {range ? <Text style={styles.dates}>{range}</Text> : null}
          </View>
          {bullets.length > 0 ? (
            <View style={styles.bullets}>
              {bullets.map((bullet, index) => (
                <Text key={index} style={styles.bullet}>
                  {"\u2022  "}
                  {bullet}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )
    })

  const renderEducation = (entries: EducationEntry[]) =>
    entries.map((entry) => {
      const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
      const title = joinNonEmpty([entry.degree, entry.fieldOfStudy], " · ")
      return (
        <View key={entry.id} style={{ marginBottom: 8 }} wrap={false}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.entryTitle}>{entry.school || title}</Text>
              {title ? (
                <Text style={styles.entrySub}>
                  {title}
                  {entry.location ? ` · ${entry.location}` : ""}
                </Text>
              ) : null}
            </View>
            {range ? <Text style={styles.dates}>{range}</Text> : null}
          </View>
          {entry.details.trim() ? <Text style={styles.paragraph}>{entry.details}</Text> : null}
        </View>
      )
    })

  const renderLeadership = (entries: LeadershipEntry[]) =>
    entries.map((entry) => {
      const range = formatDateRange(entry.startDate, entry.endDate, entry.current)
      const bullets = entry.bullets.filter((b) => b.trim())
      return (
        <View key={entry.id} style={{ marginBottom: 9 }} wrap={false}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.entryTitle}>{entry.role || entry.organization}</Text>
              <Text style={styles.entrySub}>
                {joinNonEmpty([entry.organization, entry.location], " · ")}
              </Text>
            </View>
            {range ? <Text style={styles.dates}>{range}</Text> : null}
          </View>
          {bullets.length > 0 ? (
            <View style={styles.bullets}>
              {bullets.map((bullet, index) => (
                <Text key={index} style={styles.bullet}>
                  {"\u2022  "}
                  {bullet}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )
    })

  const renderOther = (groups: OtherGroup[]) =>
    groups
      .filter((group) => group.values.some((value) => value.trim()))
      .map((group) => (
        <Text key={group.id} style={styles.otherRow}>
          {group.label.trim() ? (
            <Text style={styles.otherLabel}>{`${group.label}: `}</Text>
          ) : null}
          {group.values.map((value) => value.trim()).filter(Boolean).join(", ")}
        </Text>
      ))

  const renderProjects = (entries: ProjectEntry[]) =>
    entries.map((entry) => {
      const bullets = entry.bullets.filter((b) => b.trim())
      return (
        <View key={entry.id} style={{ marginBottom: 8 }} wrap={false}>
          <Text style={styles.entryTitle}>{entry.name}</Text>
          {entry.link.trim() || entry.techStack.trim() ? (
            <Text style={styles.entrySub}>
              {joinNonEmpty([entry.link, entry.techStack], "  ·  ")}
            </Text>
          ) : null}
          {entry.description.trim() ? (
            <Text style={[styles.paragraph, { marginTop: 2 }]}>{entry.description}</Text>
          ) : null}
          {bullets.length > 0 ? (
            <View style={styles.bullets}>
              {bullets.map((bullet, index) => (
                <Text key={index} style={styles.bullet}>
                  {"\u2022  "}
                  {bullet}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )
    })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {variant === "minimal" ? <View style={styles.accentBar} fixed /> : null}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{data.personal.fullName}</Text>
            <Text style={styles.title}>{data.personal.jobTitle}</Text>
            {variant === "minimal" ? null : (
              <Text style={styles.contact}>{contactParts}</Text>
            )}
          </View>
          {variant === "minimal" && contactParts ? (
            <View style={styles.contactRight}>
              {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website]
                .filter((part) => part.trim())
                .map((part, index) => (
                  <Text key={index}>{part}</Text>
                ))}
            </View>
          ) : null}
        </View>
        {order.map((key) => (
          <View key={key} style={styles.section}>
            <SectionTitle title={TITLES[key]} styles={styles} />
            {renderSection(key)}
          </View>
        ))}
      </Page>
    </Document>
  )
}
