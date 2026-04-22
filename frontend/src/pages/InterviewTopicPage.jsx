import { useMemo } from 'react'
import ModuleLearningPage from '../components/modules/ModuleLearningPage'
import { useProgress } from '../context/ProgressContext'
import { getInterviewTopic } from '../data/interviewTopics'
import { normalizeModuleItems } from '../lib/moduleItems'

export default function InterviewTopicPage({ topicId }) {
  const { map, toggleDone, saveQuestionNotes } = useProgress()
  const topic = getInterviewTopic(topicId)
  const categories = topic?.categories ?? []
  const rows = useMemo(
    () =>
      categories.flatMap((c) =>
        (c.questions ?? []).map((q) => ({ ...q, topic: q.topic || c.label }))
      ),
    [categories]
  )
  const items = useMemo(() => normalizeModuleItems(topicId, rows), [topicId, rows])

  if (!topic) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-8 text-neutral-400">
        Topic not found.
      </div>
    )
  }

  return (
    <ModuleLearningPage
      moduleId={topicId}
      items={items}
      map={map}
      toggleDone={toggleDone}
      saveQuestionNotes={saveQuestionNotes}
    />
  )
}
