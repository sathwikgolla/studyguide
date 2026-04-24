import { useMemo, useState } from 'react'
import { Play, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getJson, postJson } from '../lib/api'
import { useSubscription } from '../hooks/useSubscription'
import PremiumLockOverlay from '../components/premium/PremiumLockOverlay'
import TimerComponent from '../components/modules/TimerComponent'
import QuestionPanel from '../components/mock/QuestionPanel'
import ResultSummary from '../components/mock/ResultSummary'

export default function MockInterviewPage() {
  const { token } = useAuth()
  const { isPremium, loading } = useSubscription()
  const [session, setSession] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0)
  const [result, setResult] = useState(null)
  const attempted = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  )

  const startMock = async () => {
    if (!token) return
    const data = await getJson('/api/mock/start?count=5&durationMinutes=30', { token })
    setSession(data)
    setAnswers({})
    setResult(null)
    setTimeTakenSeconds(0)
    setTimerRunning(true)
  }

  const submitMock = async () => {
    if (!token || !session?.sessionId) return
    const data = await postJson(
      '/api/mock/submit',
      {
        sessionId: session.sessionId,
        attempted,
        correct: attempted,
        timeTakenSeconds,
      },
      { token }
    )
    setTimerRunning(false)
    setResult(data.result || null)
  }

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-white">Mock Interview Mode</h2>
        {session ? <TimerComponent running={timerRunning} onStop={(seconds) => setTimeTakenSeconds(seconds)} /> : null}
      </div>
      <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
        <p className="text-sm text-neutral-300">
          Simulate a real interview with 3-5 random questions and a fixed timer.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={startMock}
            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
          >
            <Play className="size-3.5" />
            Start Interview
          </button>
          {session ? (
            <button
              type="button"
              onClick={submitMock}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-neutral-200 transition hover:border-indigo-400/40"
            >
              <Send className="size-3.5" />
              Submit
            </button>
          ) : null}
        </div>
      </div>
      {session?.questions?.length ? (
        <QuestionPanel
          questions={session.questions}
          answers={answers}
          onToggle={(questionId, done) => {
            setAnswers((prev) => ({ ...prev, [questionId]: done }))
          }}
        />
      ) : null}
      <ResultSummary result={result} />
      {!loading && !isPremium ? (
        <PremiumLockOverlay
          title="Mock Interview is Premium"
          description="Upgrade to Premium to unlock timed mock interview sessions and performance scoring."
        />
      ) : null}
    </div>
  )
}
