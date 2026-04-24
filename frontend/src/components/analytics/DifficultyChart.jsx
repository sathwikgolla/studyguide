import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#f43f5e']

export default function DifficultyChart({ difficulty = { Easy: 0, Medium: 0, Hard: 0 } }) {
  const data = [
    { name: 'Easy', value: difficulty.Easy || 0 },
    { name: 'Medium', value: difficulty.Medium || 0 },
    { name: 'Hard', value: difficulty.Hard || 0 },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
      <h3 className="text-sm font-semibold text-neutral-200">Difficulty Distribution</h3>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
