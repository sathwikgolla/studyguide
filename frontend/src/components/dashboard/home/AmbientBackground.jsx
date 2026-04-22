export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />
    </div>
  )
}
