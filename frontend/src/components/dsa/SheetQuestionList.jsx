/* eslint-disable react-hooks/set-state-in-effect -- hydrate progress from localStorage or API on mount */
import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ExternalLink, StickyNote } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import DifficultyBadge from './DifficultyBadge'
import QuestionNotesModal from './QuestionNotesModal'

export default function SheetQuestionList({ progressKey, questions, filter }) {
  const { map, hydrated, toggleDone, saveQuestionNotes } = useProgress()

  const [notesModal, setNotesModal] = useState(null)

  const handleToggle = useCallback(
    (link) => {
      toggleDone(progressKey, link)
    },
    [progressKey, toggleDone]
  )

  const openNotes = useCallback(
    (q) => {
      setNotesModal({
        link: q.link,
        title: q.title,
        notes: map[q.link]?.notes ?? '',
      })
    },
    [map]
  )

  const saveNotes = useCallback(
    (text) => {
      if (!notesModal) return
      saveQuestionNotes(progressKey, notesModal.link, text)
      setNotesModal(null)
    },
    [notesModal, progressKey, saveQuestionNotes]
  )

  const rows = useMemo(() => {
    if (filter === 'All') return questions
    return questions.filter((q) => q.difficulty === filter)
  }, [questions, filter])

  if (!hydrated) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">Loading progress…</p>
    )
  }

  if (!rows.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">No problems match this filter.</p>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/30 shadow-inner shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/90 text-xs uppercase tracking-wider text-neutral-500">
                <th className="w-12 px-3 py-3 font-medium" scope="col">
                  <span className="sr-only">Done</span>
                </th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Topic</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="w-44 px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((q, i) => {
                const done = Boolean(map[q.link]?.completed)
                const hasNotes = Boolean(map[q.link]?.notes?.trim())
                return (
                  <tr
                    key={`${q.link}-${i}`}
                    className={[
                      'group border-b border-neutral-800/70 last:border-b-0',
                      'transition-all duration-300 ease-out hover:bg-neutral-900/45',
                      done ? 'bg-emerald-500/[0.04] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.18)]' : '',
                    ].join(' ')}
                  >
                    <td className="px-3 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => handleToggle(q.link)}
                        className={[
                          'size-4 cursor-pointer rounded border-neutral-600 bg-neutral-900 text-indigo-500 accent-indigo-500',
                          'focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-0',
                          'transition-all duration-200 ease-out',
                          done ? 'scale-110 shadow-[0_0_0_3px_rgba(99,102,241,0.2)]' : 'hover:scale-105',
                        ].join(' ')}
                        aria-label={`Mark complete: ${q.title}`}
                      />
                    </td>
                    <td className="max-w-xs px-4 py-3 align-middle">
                      <span
                        className={[
                          'font-medium transition-all duration-300 ease-out',
                          done ? 'text-neutral-500 line-through decoration-emerald-400/70' : 'text-neutral-100',
                        ].join(' ')}
                      >
                        {q.title}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle text-neutral-400">
                      {q.topic}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex justify-end gap-2">
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900/80 px-2.5 py-1.5 text-xs font-medium text-indigo-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-200"
                        >
                          Link
                          <ExternalLink className="size-3.5 opacity-80" aria-hidden />
                        </a>
                        <button
                          type="button"
                          onClick={() => openNotes(q)}
                          className={[
                            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition',
                            hasNotes
                              ? 'border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/15'
                              : 'border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800',
                          ].join(' ')}
                        >
                          <StickyNote className="size-3.5 opacity-80" aria-hidden />
                          Notes
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {notesModal && (
          <QuestionNotesModal
            key={notesModal.link}
            title={notesModal.title}
            initialNotes={notesModal.notes}
            onSave={saveNotes}
            onClose={() => setNotesModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
