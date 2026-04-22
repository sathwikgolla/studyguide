import { ExternalLink } from 'lucide-react'

export default function ResourceButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/35 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition hover:border-indigo-400/60 hover:bg-indigo-500/15"
    >
      Watch
      <ExternalLink className="size-3.5" aria-hidden />
    </a>
  )
}
