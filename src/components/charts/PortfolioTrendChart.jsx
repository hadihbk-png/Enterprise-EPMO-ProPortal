import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 48 },
  { month: 'Mar', value: 53 },
  { month: 'Apr', value: 51 },
  { month: 'May', value: 62 },
  { month: 'Jun', value: 68 },
]

export default function PortfolioTrendChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioTrend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
          <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#portfolioTrend)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
