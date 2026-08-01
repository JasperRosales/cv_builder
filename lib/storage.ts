import { createEmptyResume, createId } from "@/lib/defaults"
import type {
  LeadershipEntry,
  OtherGroup,
  ResumeData,
  ResumeState,
  SectionKey,
  WorkEntry,
} from "@/lib/types"
import { ACCENT_MAP, EXPORT_VERSION, SECTIONS, SECTION_KEYS, STORAGE_KEY, TEMPLATE_MAP } from "@/lib/constants"

export function loadResume(): ResumeState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ResumeState
    return normalizeResume(parsed)
  } catch {
    return null
  }
}

export function saveResume(state: ResumeState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, updatedAt: Date.now() })
    )
  } catch {
    // Storage may be unavailable (private mode / quota). Fail silently.
  }
}

export function clearResume(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function normalizeResume(input: ResumeState): ResumeState {
  const empty = createEmptyResume()
  const data = input?.data ?? empty.data
  const config = input?.config ?? empty.config

  const work: WorkEntry[] = Array.isArray(data.work)
    ? data.work
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          ...empty.data.work[0],
          ...entry,
          bullets: Array.isArray(entry.bullets) ? entry.bullets : [],
        }))
    : []

  const leadership: LeadershipEntry[] = Array.isArray(data.leadership)
    ? data.leadership
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          ...empty.data.leadership[0],
          ...entry,
          bullets: Array.isArray(entry.bullets) ? entry.bullets : [],
        }))
    : []

  const other: OtherGroup[] = Array.isArray(data.other)
    ? data.other
        .filter((group) => group && typeof group === "object")
        .map((group) => ({
          id: typeof group.id === "string" && group.id ? group.id : createId(),
          label: typeof group.label === "string" ? group.label : "",
          values: Array.isArray(group.values)
            ? group.values.filter((value) => typeof value === "string")
            : [],
        }))
    : []

  return {
    data: {
      personal: { ...empty.data.personal, ...data.personal },
      summary: typeof data.summary === "string" ? data.summary : "",
      work,
      education: Array.isArray(data.education) ? data.education : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      leadership,
      other,
    },
    config: {
      template: TEMPLATE_MAP[config.template] ? config.template : "modern",
      accent: ACCENT_MAP[config.accent] ? config.accent : "slate",
      sectionOrder: normalizeSectionOrder(config.sectionOrder),
    },
  }
}

function normalizeSectionOrder(order: SectionKey[] | undefined): SectionKey[] {
  const valid = Array.isArray(order)
    ? order.filter((key): key is SectionKey => key in SECTIONS)
    : []
  const seen = new Set<SectionKey>()
  const unique = valid.filter((key) => {
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  for (const key of SECTION_KEYS) {
    if (!seen.has(key)) unique.push(key)
  }
  return unique
}

export interface ExportFile {
  app: string
  version: number
  exportedAt: string
  resume: ResumeState
}

export function serializeResume(state: ResumeState): string {
  const payload: ExportFile = {
    app: "cv-builder",
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    resume: state,
  }
  return JSON.stringify(payload, null, 2)
}

export function deserializeResume(raw: string): ResumeState {
  const parsed = JSON.parse(raw) as ExportFile
  if (parsed && parsed.app === "cv-builder" && parsed.resume) {
    return normalizeResume(parsed.resume)
  }
  const direct = JSON.parse(raw) as ResumeState
  if (direct && typeof direct === "object" && "data" in direct && "config" in direct) {
    return normalizeResume(direct)
  }
  throw new Error("Unrecognized resume file")
}

export function downloadJson(state: ResumeState, filename = "resume.json"): void {
  const blob = new Blob([serializeResume(state)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/[^a-z0-9-_ ]/gi, "").replace(/\s+/g, "-")
  return trimmed || "resume"
}

export { createId }

export type { ResumeData, SectionKey }
