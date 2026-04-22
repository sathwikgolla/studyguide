import { useEffect, useState } from 'react'

export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const from = value
    const to = Number(target) || 0
    let frame = 0

    const tick = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}
