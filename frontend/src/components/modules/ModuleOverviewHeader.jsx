export default function ModuleOverviewHeader({ variant }) {
  return (
    <section className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${variant.accent} p-5 ${variant.glow}`}>
      <div className="pointer-events-none absolute inset-0 bg-neutral-950/70" />
      <div className="relative z-10">
        <p className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${variant.chip}`}>
          {variant.key.toUpperCase()}
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">{variant.title}</h2>
        <p className="mt-1 text-sm text-neutral-300">{variant.subtitle}</p>
      </div>
    </section>
  )
}
