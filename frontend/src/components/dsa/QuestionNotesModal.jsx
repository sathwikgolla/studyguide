import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const MotionDiv = motion.div

const ease = [0.16, 1, 0.3, 1]

export default function QuestionNotesModal({ title, initialNotes, onSave, onClose }) {
  const titleId = useId()
  const notesFieldId = useId()
  const textareaRef = useRef(null)
  const [text, setText] = useState(initialNotes)

  useLayoutEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <MotionDiv
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease }}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <MotionDiv
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-neutral-700 bg-neutral-950 shadow-2xl shadow-black/60"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{
          opacity: { duration: 0.24, ease },
          y: { type: 'spring', damping: 28, stiffness: 320 },
          scale: { type: 'spring', damping: 28, stiffness: 320 },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold leading-snug text-white">
            Notes · {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 outline-none transition hover:bg-neutral-800 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 py-4">
          <label htmlFor={notesFieldId} className="sr-only">
            Notes for this question
          </label>
          <textarea
            ref={textareaRef}
            id={notesFieldId}
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Patterns, pitfalls, solution sketch…"
            className="w-full resize-y rounded-xl border border-neutral-800 bg-black/50 px-3 py-2.5 text-sm text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(text)}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
          >
            Save
          </button>
        </div>
      </MotionDiv>
    </MotionDiv>
  )
}
