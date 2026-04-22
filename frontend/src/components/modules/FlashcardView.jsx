import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlashcardView({ card }) {
  const [flipped, setFlipped] = useState(false)
  if (!card) return null
  return (
    <button type="button" onClick={() => setFlipped((v) => !v)} className="w-full text-left">
      <motion.div
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-white/10 bg-neutral-950/60 p-4"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {!flipped ? (
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Concept</p>
            <p className="mt-1 text-sm font-semibold text-white">{card.question}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Answer</p>
            <p className="mt-1 text-sm text-neutral-200">{card.answer}</p>
          </div>
        )}
      </motion.div>
    </button>
  )
}
