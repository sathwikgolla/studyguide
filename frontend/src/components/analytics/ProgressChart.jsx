import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ProgressChart({ data = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
      <h3 className="text-sm font-semibold text-neutral-200">Total Questions Solved Over Time</h3>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip />
            <Line dataKey="solved" stroke="#6366f1" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
