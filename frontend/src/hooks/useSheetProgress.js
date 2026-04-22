import { useMemo } from 'react'

export function useSheetProgress(questions, progress) {
  return useMemo(() => {
    if (!questions || !progress) {
      return { completed: 0, total: 0, percentage: 0 }
    }

    const total = questions.length
    const completed = questions.reduce((count, question) => {
      return count + (progress.done[question.link] ? 1 : 0)
    }, 0)

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }, [questions, progress])
}
