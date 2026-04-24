export default function QuestionPanel({ questions = [], answers = {}, onToggle }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
      <h3 className="text-sm font-semibold text-neutral-200">Interview Questions</h3>
      <div className="mt-3 space-y-2">
        {questions.map((q, idx) => (
          <label
            key={`${q}-${idx}`}
            className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-neutral-200"
          >
            <input
              type="checkbox"
              checked={Boolean(answers[q])}
              onChange={(e) => onToggle(q, e.target.checked)}
              className="mt-0.5"
            />
            <span className="break-all">{q}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
