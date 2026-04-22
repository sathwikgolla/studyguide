import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getJson } from '../lib/api'

export default function AnalyticsPage() {
  const { token, userId } = useAuth()
  const [timeline, setTimeline] = useState([])
  const [distribution, setDistribution] = useState({ Easy: 0, Medium: 0, Hard: 0 })

  useEffect(() => {
    if (!token || !userId) return
    void (async () => {
      try {
        const [t, d] = await Promise.all([
          getJson(`/api/analytics/progress/${userId}`, { token }),
          getJson(`/api/analytics/distribution/${userId}`, { token }),
        ])
        setTimeline(t.timeline ?? [])
        setDistribution(d.distribution ?? { Easy: 0, Medium: 0, Hard: 0 })
      } catch {
        setTimeline([])
      }
    })()
  }, [token, userId])

  const pieData = [
    { name: 'Easy', value: distribution.Easy },
    { name: 'Medium', value: distribution.Medium },
    { name: 'Hard', value: distribution.Hard },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Analytics Dashboard</h2>
      <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
        <h3 className="text-sm font-semibold text-neutral-200">Solved Over Time</h3>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <XAxis dataKey="day" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip />
              <Line dataKey="solved" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
        <h3 className="text-sm font-semibold text-neutral-200">Difficulty Distribution</h3>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#f43f5e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
