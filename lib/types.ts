export type SectionKey =
  | "personal"
  | "summary"
  | "work"
  | "education"
  | "projects"
  | "leadership"
  | "other"

export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website: string
}

export interface WorkEntry {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationEntry {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  details: string
}

export interface ProjectEntry {
  id: string
  name: string
  link: string
  techStack: string
  description: string
  bullets: string[]
}

export interface LeadershipEntry {
  id: string
  organization: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface OtherGroup {
  id: string
  label: string
  values: string[]
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  work: WorkEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  leadership: LeadershipEntry[]
  other: OtherGroup[]
}

export type TemplateId = "modern" | "classic"

export type AccentId =
  | "slate"
  | "navy"
  | "blue"
  | "teal"
  | "forest"
  | "burgundy"
  | "violet"
  | "coffee"

export interface ResumeConfig {
  template: TemplateId
  accent: AccentId
  sectionOrder: SectionKey[]
}

export interface ResumeState {
  data: ResumeData
  config: ResumeConfig
  updatedAt?: number
}

export interface TemplateDef {
  id: TemplateId
  label: string
  description: string
}

export interface AccentDef {
  id: AccentId
  label: string
  color: string
}
