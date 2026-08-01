import type { ResumeState } from "@/lib/types"

export interface CheckResult {
  id: string
  label: string
  hint?: string
  pass: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+()\d.\-\s]{7,}$/

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0
}

function hasPlaceholder(value: string): boolean {
  if (!value) return false
  const lowered = value.toLowerCase()
  return (
    lowered.includes("your name") ||
    lowered.includes("your company") ||
    lowered.includes("example@") ||
    lowered.includes("lorem ipsum") ||
    lowered.includes("placeholder")
  )
}

export function runChecks(state: ResumeState): CheckResult[] {
  const checks: CheckResult[] = []
  const { data, config } = state
  const personal = data.personal

  checks.push({
    id: "name",
    label: "Full name is present",
    pass: hasText(personal.fullName),
    hint: "Recruiters and ATS software match resumes primarily by name and contact info.",
  })

  checks.push({
    id: "no-placeholder",
    label: "No placeholder text",
    pass: !hasPlaceholder(personal.fullName) && !hasPlaceholder(personal.jobTitle),
    hint: "Replace placeholders such as 'Your Name' with real information.",
  })

  checks.push({
    id: "title",
    label: "Job title matches your target role",
    pass: hasText(personal.jobTitle),
    hint: "Use the exact title of the job you are applying for.",
  })

  checks.push({
    id: "email",
    label: "Professional email is valid",
    pass: EMAIL_RE.test(personal.email.trim()),
    hint: "Use a professional address such as firstname.lastname@domain.com.",
  })

  checks.push({
    id: "phone",
    label: "Phone number is provided",
    pass: hasText(personal.phone) && PHONE_RE.test(personal.phone.trim()),
    hint: "Include a number with the correct country code.",
  })

  checks.push({
    id: "location",
    label: "Location is provided",
    pass: hasText(personal.location),
    hint: "City and state/country helps ATS shortlist by location.",
  })

  checks.push({
    id: "skills",
    label: "Skills and additional details listed",
    pass: data.other.some((group) => group.values.some((value) => hasText(value))),
    hint: "Add skills, certifications, languages or links that match the job description.",
  })

  checks.push({
    id: "summary",
    label: "Summary is written",
    pass: hasText(data.summary) && data.summary.trim().length >= 40,
    hint: "Write 2–4 sentences summarizing your experience and value.",
  })

  checks.push({
    id: "experience",
    label: "Work experience included",
    pass: data.work.some((entry) => hasText(entry.company) && hasText(entry.position)),
    hint: "List at least your most recent or most relevant role.",
  })

  checks.push({
    id: "achievements",
    label: "Experience uses achievement bullets",
    pass:
      data.work.length > 0 &&
      data.work.some(
        (entry) =>
          Array.isArray(entry.bullets) &&
          entry.bullets.some((bullet) => bullet.trim().length >= 15)
      ),
    hint: "Use bullets that start with action verbs and include measurable results.",
  })

  checks.push({
    id: "dates",
    label: "Roles include dates",
    pass:
      data.work.length === 0 ||
      data.work.some((entry) => hasText(entry.startDate) && hasText(entry.endDate) || hasText(entry.startDate) && entry.current),
    hint: "Include start and end dates (or 'Present') for every role.",
  })

  checks.push({
    id: "education",
    label: "Education included",
    pass: data.education.some((entry) => hasText(entry.school) && hasText(entry.degree)),
    hint: "Include your highest degree even if it is in progress.",
  })

  checks.push({
    id: "one-page",
    label: "Likely to fit one page",
    pass: estimateLength(state) <= 1,
    hint: "A one-page resume is ideal for most roles. Trim older roles if needed.",
  })

  checks.push({
    id: "order",
    label: "Section order is effective",
    pass:
      config.sectionOrder.length >= 4 &&
      config.sectionOrder.slice(0, 3).every((key) =>
        ["summary", "work", "education", "other"].includes(key)
      ),
    hint: "Lead with the sections that are most relevant to the role.",
  })

  return checks
}

export function countPassed(checks: CheckResult[]): number {
  return checks.filter((check) => check.pass).length
}

function estimateLength(state: ResumeState): number {
  const { data } = state
  let score = 1
  if (hasText(data.summary)) score += 0.15
  score += data.work.reduce((acc, entry) => {
    let value = 0.28
    if (entry.bullets.length > 3) value += 0.08
    return acc + value
  }, 0)
  if (data.education.length > 0) score += 0.2
  score += data.leadership.length * 0.18
  score += data.projects.length * 0.16
  score += data.other.reduce(
    (acc, group) =>
      acc + Math.min(group.values.filter((value) => value.trim()).length, 6) * 0.02,
    0
  )
  return score
}
