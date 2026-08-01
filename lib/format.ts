export function formatMonthYear(value: string): string {
  if (!value) return ""
  if (/^\d{4}$/.test(value.trim())) return value.trim()
  const match = value.trim().match(/^(\d{4})-(\d{1,2})$/)
  if (!match) return value
  const year = match[1]
  const month = Number(match[2])
  if (month < 1 || month > 12) return value
  const name = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
    month: "short",
  })
  return `${name} ${year}`
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean
): string {
  const startText = formatMonthYear(start)
  const endText = current ? "Present" : formatMonthYear(end)
  if (startText && endText) return `${startText} – ${endText}`
  return startText || endText || ""
}

export function formatEducationRange(
  start: string,
  end: string,
  current: boolean
): string {
  return formatDateRange(start, end, current)
}

export function joinNonEmpty(parts: Array<string | undefined>, separator = " · "): string {
  return parts.filter((part) => part && part.trim().length > 0).join(separator)
}
