const LEGACY_DSA_PREFIX = 'prepflow:dsa:sheet:'
const QLIST_PREFIX = 'prepflow:qlist:'

function parseProgress(raw) {
  if (!raw) return { done: {}, notes: {} }
  try {
    const parsed = JSON.parse(raw)
    return {
      done: typeof parsed.done === 'object' && parsed.done !== null ? parsed.done : {},
      notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {},
    }
  } catch {
    return { done: {}, notes: {} }
  }
}

/** Unified storage for any question list (DSA sheets, OS/CN/etc. categories). */
export function loadProgress(progressKey) {
  try {
    const raw = localStorage.getItem(`${QLIST_PREFIX}${progressKey}`)
    if (raw) return parseProgress(raw)

    if (progressKey.startsWith('dsa-')) {
      const idx = progressKey.slice('dsa-'.length)
      const legacy = localStorage.getItem(`${LEGACY_DSA_PREFIX}${idx}`)
      if (legacy) {
        const data = parseProgress(legacy)
        saveProgress(progressKey, data)
        try {
          localStorage.removeItem(`${LEGACY_DSA_PREFIX}${idx}`)
        } catch {
          /* ignore */
        }
        return data
      }
    }
    return { done: {}, notes: {} }
  } catch {
    return { done: {}, notes: {} }
  }
}

export function saveProgress(progressKey, progress) {
  try {
    localStorage.setItem(`${QLIST_PREFIX}${progressKey}`, JSON.stringify(progress))
  } catch {
    /* quota / private mode */
  }
}

/** @deprecated prefer loadProgress(`dsa-${index}`) */
export function loadSheetProgress(sheetIndex) {
  return loadProgress(`dsa-${sheetIndex}`)
}

/** @deprecated prefer saveProgress(`dsa-${index}`, progress) */
export function saveSheetProgress(sheetIndex, progress) {
  saveProgress(`dsa-${sheetIndex}`, progress)
}
