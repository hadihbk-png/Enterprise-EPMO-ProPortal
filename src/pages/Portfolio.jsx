import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { Columns3, LayoutGrid, Table2 } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { getPrograms } from '../services/programsService.js'

const resourceCapacity = [
  { month: 'Jan', pm: 8, sme: 14, business: 10, limit: 42 },
  { month: 'Feb', pm: 9, sme: 16, business: 12, limit: 42 },
  { month: 'Mar', pm: 11, sme: 18, business: 14, limit: 42 },
  { month: 'Apr', pm: 12, sme: 20, business: 15, limit: 42 },
  { month: 'May', pm: 13, sme: 22, business: 17, limit: 42 },
  { month: 'Jun', pm: 12, sme: 21, business: 18, limit: 42 },
]

const ragColors = {
  Red: '#f43f5e',
  Amber: '#f59e0b',
  Green: '#10b981',
}

const priorityColors = {
  Critical: '#f43f5e',
  High: '#f59e0b',
  Medium: '#06b6d4',
  Low: '#94a3b8',
}

function money(value) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function Chip({ children, color }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}20` }}>
      {children}
    </span>
  )
}

function PortfolioTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 p-3 text-sm shadow-2xl">
      <p className="font-semibold text-white">{item.name}</p>
      <p className="mt-1 text-slate-300">Budget: {money(item.budgetAllocated)}</p>
      <p className="text-slate-300">Strategic Value: {item.strategicValue}/10</p>
      <p className="text-slate-300">Delivery Confidence: {item.deliveryConfidence}/10</p>
    </div>
  )
}

function QuadrantLabels() {
  return (
    <div className="pointer-events-none absolute inset-x-8 bottom-12 top-6 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl text-center text-xs font-semibold uppercase tracking-wider">
      <div className="grid place-items-center bg-amber-400/[0.06] text-amber-200/60">Strategic but Risky</div>
      <div className="grid place-items-center bg-emerald-400/[0.07] text-emerald-200/70">Invest & Accelerate</div>
      <div className="grid place-items-center bg-rose-400/[0.06] text-rose-200/60">Reconsider</div>
      <div className="grid place-items-center bg-cyan-400/[0.06] text-cyan-200/60">Quick Wins</div>
    </div>
  )
}

function InvestmentSummary({ portfolioPrograms, totalBudget }) {
  return (
    <Card className="h-full">
      <h2 className="text-lg font-semibold text-white">Investment Summary</h2>
      <div className="relative mt-4 h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={portfolioPrograms}
              dataKey="budgetAllocated"
              nameKey="name"
              innerRadius={72}
              outerRadius={104}
              paddingAngle={3}
              stroke="rgba(255,255,255,0.12)"
              isAnimationActive
            >
              {portfolioPrograms.map((program) => (
                <Cell key={program.id} fill={program.portfolioColor} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => money(value)} contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Total Portfolio Budget</p>
            <p className="mt-1 text-2xl font-semibold text-white">{money(totalBudget)}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-3">
        {portfolioPrograms.map((program) => {
          const percent = totalBudget ? Math.round((program.budgetAllocated / totalBudget) * 100) : 0
          return (
            <div key={program.id} className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: program.portfolioColor }} />
              <span className="min-w-0 flex-1 truncate text-slate-200">{program.name}</span>
              <span className="text-slate-400">{money(program.budgetAllocated)}</span>
              <span className="w-10 text-right font-semibold text-white">{percent}%</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function RegisterSection({ portfolioPrograms, totalBudget, avgHealth }) {
  const [view, setView] = useState('cards')

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <div>
        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Investment Mix</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Portfolio Overview</h1>
          </div>
          <div className="flex gap-2">
            <Button variant={view === 'cards' ? 'primary' : 'ghost'} onClick={() => setView('cards')}>
              <LayoutGrid size={17} />
              Card
            </Button>
            <Button variant={view === 'table' ? 'primary' : 'ghost'} onClick={() => setView('table')}>
              <Table2 size={17} />
              Table
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Budget</p>
              <p className="mt-1 text-2xl font-semibold text-white">{money(totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Programs Count</p>
              <p className="mt-1 text-2xl font-semibold text-white">{portfolioPrograms.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Avg RAG Health</p>
              <p className="mt-1 text-2xl font-semibold text-white">{avgHealth}%</p>
            </div>
          </div>
        </Card>

        {view === 'cards' ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {portfolioPrograms.map((program) => (
              <Card key={program.id}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">{program.name}</h2>
                  <Chip color={ragColors[program.rag]}>{program.rag}</Chip>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between gap-3"><span>Budget</span><span className="font-semibold text-white">{money(program.budgetAllocated)}</span></div>
                  <div className="flex justify-between gap-3"><span>Strategic alignment</span><span>{program.strategicAlignment}/10</span></div>
                  <div className="flex justify-between gap-3"><span>Delivery confidence</span><span>{program.deliveryConfidence}/10</span></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-400">
                  <tr><th className="p-3">Program</th><th className="p-3">RAG</th><th className="p-3">Budget</th><th className="p-3">Strategic Alignment</th><th className="p-3">Delivery Confidence</th></tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {portfolioPrograms.map((program) => (
                    <tr key={program.id}>
                      <td className="p-3 font-semibold text-white">{program.name}</td>
                      <td className="p-3"><Chip color={ragColors[program.rag]}>{program.rag}</Chip></td>
                      <td className="p-3">{money(program.budgetAllocated)}</td>
                      <td className="p-3">{program.strategicAlignment}/10</td>
                      <td className="p-3">{program.deliveryConfidence}/10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      <InvestmentSummary portfolioPrograms={portfolioPrograms} totalBudget={totalBudget} />
    </div>
  )
}

function MatrixChart({ portfolioPrograms }) {
  const data = portfolioPrograms.map((program) => ({
    ...program,
    budgetSize: Math.max(180, program.budgetAllocated / 9000),
  }))

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Strategic Alignment Matrix</h2>
      <div className="relative mt-4 h-96">
        <QuadrantLabels />
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 22, right: 20, bottom: 16, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" />
            <XAxis type="number" dataKey="deliveryConfidence" name="Delivery Confidence" domain={[0, 10]} tickCount={6} stroke="#94a3b8" />
            <YAxis type="number" dataKey="strategicValue" name="Strategic Value" domain={[0, 10]} tickCount={6} stroke="#94a3b8" />
            <ZAxis type="number" dataKey="budgetSize" range={[220, 1100]} />
            <ReferenceLine x={5} stroke="rgba(255,255,255,0.35)" strokeDasharray="5 5" />
            <ReferenceLine y={5} stroke="rgba(255,255,255,0.35)" strokeDasharray="5 5" />
            <Tooltip content={<PortfolioTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} isAnimationActive>
              {data.map((program) => (
                <Cell key={program.id} fill={program.portfolioColor} fillOpacity={0.82} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function CapacityChart() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Resource Capacity</h2>
      <div className="mt-4 h-96">
        <ResponsiveContainer>
          <BarChart data={resourceCapacity} margin={{ top: 22, right: 20, bottom: 10, left: -14 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 18 }} />
            <ReferenceLine y={42} stroke="#f43f5e" strokeDasharray="7 6" label={{ value: 'Capacity limit', fill: '#fda4af', position: 'insideTopRight' }} />
            <Bar dataKey="pm" name="PM allocation" stackId="capacity" fill="#6366f1" radius={[0, 0, 4, 4]} isAnimationActive />
            <Bar dataKey="sme" name="SME allocation" stackId="capacity" fill="#06b6d4" isAnimationActive />
            <Bar dataKey="business" name="Business allocation" stackId="capacity" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive />
            <Line dataKey="limit" stroke="#f43f5e" strokeDasharray="7 6" dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function KanbanBoard({ initialPrograms }) {
  const [items, setItems] = useState(initialPrograms)
  const priorities = ['Critical', 'High', 'Medium', 'Low']

  function onDrop(priority, event) {
    const id = event.dataTransfer.getData('programId')
    setItems((current) => current.map((program) => (program.id === id ? { ...program, priority } : program)))
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Columns3 size={20} className="text-emerald-300" />
        <h2 className="text-lg font-semibold text-white">Priority Kanban Board</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {priorities.map((priority) => {
          const columnItems = items.filter((program) => program.priority === priority)
          const total = columnItems.reduce((sum, program) => sum + program.budgetAllocated, 0)
          return (
            <div
              key={priority}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onDrop(priority, event)}
              className="min-h-72 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="mb-3 flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: `${priorityColors[priority]}20`, color: priorityColors[priority] }}>
                <span className="font-semibold">{priority}</span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs font-semibold">{columnItems.length}</span>
              </div>
              <p className="mb-3 px-1 text-xs text-slate-400">Total: {money(total)}</p>
              <div className="space-y-3">
                {columnItems.map((program) => (
                  <div
                    key={program.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('programId', program.id)}
                    className="cursor-grab rounded-xl border border-white/10 bg-slate-950/35 p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-white">{program.name}</p>
                      <Chip color={ragColors[program.rag]}>{program.rag}</Chip>
                    </div>
                    <div className="mt-3 text-sm text-slate-400">
                      <p>{money(program.budgetAllocated)}</p>
                      <p>{program.sponsor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function Portfolio() {
  const [portfolioPrograms, setPortfolioPrograms] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    getPrograms().then(setPortfolioPrograms).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])
  const totalBudget = useMemo(() => portfolioPrograms.reduce((sum, program) => sum + program.budgetAllocated, 0), [portfolioPrograms])
  const avgHealth = useMemo(() => {
    const scores = { Green: 100, Amber: 65, Red: 30 }
    return portfolioPrograms.length ? Math.round(portfolioPrograms.reduce((sum, program) => sum + scores[program.rag], 0) / portfolioPrograms.length) : 0
  }, [portfolioPrograms])

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      {error && <Card className="text-rose-200">{error}</Card>}
      <RegisterSection portfolioPrograms={portfolioPrograms} totalBudget={totalBudget} avgHealth={avgHealth} />
      <div className="grid gap-4 xl:grid-cols-2">
        <MatrixChart portfolioPrograms={portfolioPrograms} />
        <CapacityChart />
      </div>
      <KanbanBoard initialPrograms={portfolioPrograms} />
    </section>
  )
}
