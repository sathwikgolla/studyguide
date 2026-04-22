import { dsaSheets } from '../data/dsa'
import { getInterviewTopic, interviewTopicIds } from '../data/interviewTopics'
import { loadProgress } from './dsaProgress'

/** Aggregates DSA checklist progress across all sheets (localStorage). */
export function getDsaProgressStats() {
  let done = 0
  let total = 0
  let notesCount = 0

  dsaSheets.forEach((sheet, sheetIndex) => {
    const questions = sheet.questions ?? []
    total += questions.length
    const p = loadProgress(`dsa-${sheetIndex}`)
    for (const q of questions) {
      if (p.done[q.link]) done += 1
      if (p.notes[q.link]?.trim()) notesCount += 1
    }
  })

  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, notesCount, pct }
}

/** Aggregates progress for a single interview topic (localStorage). */
export function getTopicProgressStats(topicId) {
  const topic = getInterviewTopic(topicId)
  if (!topic) return { done: 0, total: 0, notesCount: 0, pct: 0 }

  let done = 0
  let total = 0
  let notesCount = 0

  for (const cat of topic.categories ?? []) {
    const questions = cat.questions ?? []
    total += questions.length
    const p = loadProgress(`${topicId}-${cat.id}`)
    for (const q of questions) {
      if (p.done[q.link]) done += 1
      if (p.notes[q.link]?.trim()) notesCount += 1
    }
  }

  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, notesCount, pct }
}

/** Aggregates combined progress across ALL topics (DSA + OS + CN + DBMS + Fullstack). */
export function getCombinedProgressStats() {
  const dsa = getDsaProgressStats()
  let done = dsa.done
  let total = dsa.total
  let notesCount = dsa.notesCount

  const topicStats = {}
  for (const topicId of interviewTopicIds) {
    const s = getTopicProgressStats(topicId)
    topicStats[topicId] = s
    done += s.done
    total += s.total
    notesCount += s.notesCount
  }

  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, notesCount, pct, dsa, topicStats }
}
