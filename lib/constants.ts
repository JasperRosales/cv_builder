import type {
  AccentDef,
  AccentId,
  SectionKey,
  TemplateDef,
  TemplateId,
} from "@/lib/types"

export const STORAGE_KEY = "cv-builder:resume:v1"

export const EXPORT_VERSION = 1

export const SECTIONS: Record<SectionKey, { label: string; description: string }> = {
  personal: { label: "Personal Details", description: "Name, job title and contact information" },
  summary: { label: "Professional Summary", description: "A short, punchy pitch about you" },
  work: { label: "Work Experience", description: "Roles, companies and key achievements" },
  education: { label: "Education", description: "Schools, degrees and relevant coursework" },
  projects: { label: "Projects", description: "Selected projects with links and impact" },
  leadership: { label: "Leadership", description: "Leadership and volunteer experience" },
  other: { label: "Other", description: "Skills, certifications, languages and links" },
}

export const SECTION_KEYS: SectionKey[] = Object.keys(SECTIONS) as SectionKey[]

export const TEMPLATES: TemplateDef[] = [
  {
    id: "modern",
    label: "Modern",
    description: "Centered header, single column, clean and recruiter friendly.",
  },
  {
    id: "classic",
    label: "Classic",
    description: "Serif typography with a traditional, professional structure.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Compact and light with a slim accent bar on the left.",
  },
]

export const TEMPLATE_MAP: Record<TemplateId, TemplateDef> = TEMPLATES.reduce(
  (acc, template) => {
    acc[template.id] = template
    return acc
  },
  {} as Record<TemplateId, TemplateDef>
)

export const ACCENTS: AccentDef[] = [
  { id: "slate", label: "Slate", color: "#334155" },
  { id: "navy", label: "Navy", color: "#1e3a5f" },
  { id: "blue", label: "Blue", color: "#1d4ed8" },
  { id: "teal", label: "Teal", color: "#0f766e" },
  { id: "forest", label: "Forest", color: "#15803d" },
  { id: "burgundy", label: "Burgundy", color: "#9f1239" },
  { id: "violet", label: "Violet", color: "#6d28d9" },
  { id: "coffee", label: "Coffee", color: "#92400e" },
]

export const ACCENT_MAP: Record<AccentId, AccentDef> = ACCENTS.reduce(
  (acc, accent) => {
    acc[accent.id] = accent
    return acc
  },
  {} as Record<AccentId, AccentDef>
)

export const BULLET_PROMPTS: Record<SectionKey, string[]> = {
  personal: [],
  summary: [],
  work: [
    "Achieved X, resulting in Y",
    "Led a team of X to ...",
    "Built X using Y, improving Z by N%",
  ],
  education: [],
  projects: [
    "Built X that ...",
    "Used Y to solve Z",
  ],
  leadership: [
    "Mentored a team of X, improving ...",
    "Organized Y, reaching Z people",
  ],
  other: [],
}
