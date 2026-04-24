import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function TopicChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
      <h3 className="text-sm font-semibold text-neutral-200">Topic-wise Progress</h3>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="topic" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip />
            <Bar dataKey="completionPct" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
