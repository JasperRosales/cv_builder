import type {
  EducationEntry,
  LeadershipEntry,
  OtherGroup,
  PersonalInfo,
  ProjectEntry,
  ResumeConfig,
  ResumeData,
  ResumeState,
  SectionKey,
  WorkEntry,
} from "@/lib/types"

export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function createEmptyPersonal(): PersonalInfo {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  }
}

export function createEmptyWork(): WorkEntry {
  return {
    id: createId(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  }
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: createId(),
    school: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    details: "",
  }
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: createId(),
    name: "",
    link: "",
    techStack: "",
    description: "",
    bullets: [""],
  }
}

export function createEmptyLeadership(): LeadershipEntry {
  return {
    id: createId(),
    organization: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  }
}

export function createEmptyOtherGroup(): OtherGroup {
  return {
    id: createId(),
    label: "",
    values: [""],
  }
}

export function createEmptyData(): ResumeData {
  return {
    personal: createEmptyPersonal(),
    summary: "",
    work: [],
    education: [],
    projects: [],
    leadership: [],
    other: [],
  }
}

export function defaultConfig(): ResumeConfig {
  return {
    template: "modern",
    accent: "slate",
    sectionOrder: [
      "personal",
      "summary",
      "work",
      "education",
      "projects",
      "leadership",
      "other",
    ] as SectionKey[],
  }
}

export function createEmptyResume(): ResumeState {
  return {
    data: createEmptyData(),
    config: defaultConfig(),
  }
}

export function createSampleResume(): ResumeState {
  return {
    data: {
      personal: {
        fullName: "Alex Morgan",
        jobTitle: "Senior Frontend Engineer",
        email: "alex.morgan@example.com",
        phone: "+1 (555) 012-3456",
        location: "Austin, TX",
        website: "alexmorgan.dev",
      },
      summary:
        "Frontend engineer with 8+ years of experience building accessible, high-performance web applications. Passionate about design systems, developer experience, and shipping products that users love.",
      work: [
        {
          id: createId(),
          company: "Acme Cloud",
          position: "Senior Frontend Engineer",
          location: "Remote",
          startDate: "2021-03",
          endDate: "",
          current: true,
          bullets: [
            "Led migration of a 200k LOC React codebase to TypeScript, cutting runtime errors by 60%.",
            "Built a component library used by 6 product teams, reducing design-to-code time by 40%.",
            "Improved core Web Vitals by 30% through code-splitting and image optimization.",
          ],
        },
        {
          id: createId(),
          company: "Bright Software",
          position: "Frontend Engineer",
          location: "Seattle, WA",
          startDate: "2018-06",
          endDate: "2021-02",
          current: false,
          bullets: [
            "Shipped a real-time dashboard used by 15k daily active users.",
            "Introduced automated testing with Jest and Playwright, raising coverage from 20% to 85%.",
          ],
        },
      ],
      education: [
        {
          id: createId(),
          school: "University of Washington",
          degree: "B.S.",
          fieldOfStudy: "Computer Science",
          location: "Seattle, WA",
          startDate: "2014-09",
          endDate: "2018-06",
          current: false,
          details: "",
        },
      ],
      projects: [
        {
          id: createId(),
          name: "ResumeForge",
          link: "github.com/alexmorgan/resumeforge",
          techStack: "Next.js, Tailwind CSS, react-pdf",
          description: "",
          bullets: [
            "Open-source resume builder with live preview and PDF export, used by 3k developers.",
          ],
        },
      ],
      leadership: [
        {
          id: createId(),
          organization: "Women in Tech Austin",
          role: "Chapter Co-lead",
          location: "Austin, TX",
          startDate: "2022-01",
          endDate: "",
          current: true,
          bullets: [
            "Grew the local community from 200 to 1,200 members through monthly meetups.",
            "Mentored 12 junior engineers through a 6-month pairing program.",
          ],
        },
      ],
      other: [
        {
          id: createId(),
          label: "Skills",
          values: [
            "TypeScript",
            "JavaScript",
            "React",
            "Next.js",
            "Node.js",
            "GraphQL",
            "Tailwind CSS",
            "Git",
            "Docker",
            "AWS",
          ],
        },
        {
          id: createId(),
          label: "Certifications",
          values: [
            "AWS Certified Developer – Associate",
            "Professional Scrum Master I",
          ],
        },
        {
          id: createId(),
          label: "Languages",
          values: ["English", "Spanish"],
        },
        {
          id: createId(),
          label: "Social",
          values: ["linkedin.com/in/alexmorgan", "github.com/alexmorgan"],
        },
      ],
    },
    config: {
      template: "modern",
      accent: "navy",
      sectionOrder: [
        "personal",
        "summary",
        "work",
        "education",
        "projects",
        "leadership",
        "other",
      ],
    },
  }
}
