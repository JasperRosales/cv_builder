import { createElement } from "react"

import type { ResumeState } from "@/lib/types"
import { sanitizeFilename } from "@/lib/storage"

export async function exportResumeAsPdf(state: ResumeState): Promise<void> {
  const [{ pdf }, { ResumePdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/resume/resume-pdf"),
  ])

  const filename = sanitizeFilename(state.data.personal.fullName || "resume")
  const blob = await pdf(
    createElement(ResumePdf, { state }) as unknown as Parameters<typeof pdf>[0]
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${filename}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
