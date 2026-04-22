import { BellRing } from 'lucide-react'

export default function NotificationCard({ message }) {
  if (!message) return null
  return (
    <section className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-violet-100">
        <BellRing className="size-4" aria-hidden />
        {message}
      </p>
    </section>
  )
}
