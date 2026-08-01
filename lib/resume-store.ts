import { createEmptyResume } from "@/lib/defaults"
import { clearResume, loadResume, saveResume } from "@/lib/storage"
import type { ResumeState } from "@/lib/types"

const emptyResume: ResumeState = createEmptyResume()

let current: ResumeState = emptyResume
let initialized = false
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function initResumeStore(): void {
  if (initialized) return
  const saved = loadResume()
  if (saved) current = saved
  initialized = true
  notify()
}

export function getResumeSnapshot(): ResumeState {
  return current
}

export function getResumeServerSnapshot(): ResumeState {
  return emptyResume
}

export function subscribeResume(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function updateResume(updater: (prev: ResumeState) => ResumeState): void {
  const next = updater(current)
  if (next === current) return
  current = next
  saveResume(current)
  notify()
}

export function replaceResume(next: ResumeState): void {
  current = next
  saveResume(current)
  notify()
}

export function resetResume(): void {
  current = createEmptyResume()
  clearResume()
  notify()
}
