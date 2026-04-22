import { useEffect, useRef, useState } from 'react'

export default function TimerComponent({ running, onStop }) {
  const [seconds, setSeconds] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    if (!running) return
    startRef.current = Date.now()
    const t = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(t)
  }, [running])

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-neutral-200">
      <span>Timer: {seconds}s</span>
      <button
        type="button"
        onClick={() => onStop(seconds)}
        className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-neutral-300"
      >
        Stop
      </button>
    </div>
  )
}
