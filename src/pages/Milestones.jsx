import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { getMilestones } from '../services/milestonesService.js'
import { getPrograms } from '../services/programsService.js'

const today = new Date('2026-05-10')
const statusColors = {
  'Not Started': '#94a3b8',
  'In Progress': '#3b82f6',
  Complete: '#22c55e',
  'At Risk': '#f59e0b',
  Delayed: '#ef4444',
}
const zoomDays = { Week: 7, Month: 31, Quarter: 92, Year: 365 }

function effectiveStatus(item) {
  return new Date(item.plannedDate) < today && item.status !== 'Complete' ? 'Delayed' : item.status
}

function dateValue(value) {
  return new Date(value).getTime()
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function Chip({ children, color }) {
  return <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}20` }}>{children}</span>
}

function Select({ value, onChange, children }) {
  return <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
}

function GanttMarkers({ data, minDate, maxDate }) {
  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-12 top-8">
      {data.map((item, index) => {
        const left = ((dateValue(item.plannedDate) - minDate) / (maxDate - minDate)) * 100
        return <span key={item.id} className="absolute h-3 w-3 rotate-45 border border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" style={{ left: `calc(${left}% + 112px)`, top: `calc(${index} * 34px + 14px)` }} />
      })}
    </div>
  )
}

export default function Milestones() {
  const [milestoneRegister, setMilestoneRegister] = useState([])
  const [programs, setPrograms] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ program: 'All', status: 'All', owner: 'All', start: '', end: '' })
  const [sortKey, setSortKey] = useState('plannedDate')
  const [selectedId, setSelectedId] = useState(null)
  const [zoom, setZoom] = useState('Quarter')
  useEffect(() => {
    Promise.all([getMilestones(), getPrograms()])
      .then(([milestones, programData]) => {
        setMilestoneRegister(milestones)
        setPrograms(programData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
  const owners = [...new Set(milestoneRegister.map((item) => item.owner).filter(Boolean))]

  const milestones = useMemo(() => milestoneRegister.map((item) => ({ ...item, status: effectiveStatus(item) })), [milestoneRegister])
  const filtered = useMemo(() => milestones
    .filter((item) => filters.program === 'All' || item.program === filters.program)
    .filter((item) => filters.status === 'All' || item.status === filters.status)
    .filter((item) => filters.owner === 'All' || item.owner === filters.owner)
    .filter((item) => !filters.start || new Date(item.plannedDate) >= new Date(filters.start))
    .filter((item) => !filters.end || new Date(item.plannedDate) <= new Date(filters.end))
    .sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey]))), [filters, milestones, sortKey])

  const statusCounts = ['Total', 'On Track', 'At Risk', 'Delayed', 'Complete'].map((label) => ({
    label,
    count: label === 'Total' ? milestones.length : label === 'On Track' ? milestones.filter((item) => item.status === 'In Progress' || item.status === 'Not Started').length : milestones.filter((item) => item.status === label).length,
  }))
  const fallbackDate = dateValue('2026-05-10')
  const minDate = (filtered.length ? Math.min(...filtered.map((item) => dateValue(item.plannedDate))) : fallbackDate) - 86400000 * 5
  const maxDate = Math.min(minDate + zoomDays[zoom] * 86400000, (filtered.length ? Math.max(...filtered.map((item) => dateValue(item.plannedDate))) : fallbackDate) + 86400000 * 20)
  const ganttData = filtered.map((item) => ({ ...item, start: dateValue(item.plannedDate) - 86400000 * 4, duration: 86400000 * 8 }))
  const donutData = Object.keys(statusColors).map((status) => ({ status, value: milestones.filter((item) => item.status === status).length })).filter((item) => item.value)
  const trend = ['May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month, index) => ({
    month,
    planned: [3, 2, 1, 2, 1][index],
    completed: [2, 0, 0, 0, 0][index],
  }))

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      {error && <Card className="text-rose-200">{error}</Card>}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-300">Delivery Timeline</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Milestone Tracker</h1>
      </div>
      <Card>
        <div className="mb-4 grid gap-3 lg:grid-cols-5">
          <Select value={filters.program} onChange={(program) => setFilters({ ...filters, program })}><option>All</option>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
          <Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })}><option>All</option>{Object.keys(statusColors).map((status) => <option key={status}>{status}</option>)}</Select>
          <input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={filters.start} onChange={(event) => setFilters({ ...filters, start: event.target.value })} />
          <input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={filters.end} onChange={(event) => setFilters({ ...filters, end: event.target.value })} />
          <Select value={filters.owner} onChange={(owner) => setFilters({ ...filters, owner })}><option>All</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</Select>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">{statusCounts.map((item) => <Chip key={item.label} color={item.label === 'Delayed' ? '#ef4444' : item.label === 'At Risk' ? '#f59e0b' : item.label === 'Complete' ? '#22c55e' : '#ec4899'}>{item.label}: {item.count}</Chip>)}</div>
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['id', 'name', 'program', 'owner', 'plannedDate', 'actualDate', 'status', 'percentComplete', 'actions'].map((column) => <th key={column} className="p-3"><button type="button" onClick={() => setSortKey(column)}>{column}</button></th>)}</tr></thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filtered.map((item) => <tr key={item.id} className={`${selectedId === item.id ? 'bg-pink-500/15' : 'hover:bg-white/[0.04]'}`}><td className="p-3">{item.id}</td><td className="p-3 font-semibold text-white">{item.name}</td><td className="p-3">{item.program}</td><td className="p-3">{item.owner}</td><td className="p-3">{item.plannedDate}</td><td className="p-3">{item.actualDate || '-'}</td><td className="p-3"><Chip color={statusColors[item.status]}>{item.status}</Chip></td><td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-28 rounded-full bg-white/10"><div className="h-2 rounded-full bg-pink-400" style={{ width: `${item.percentComplete}%` }} /></div>{item.percentComplete}%</div></td><td className="p-3"><Button variant="ghost" className="h-8 px-3" onClick={() => setSelectedId(item.id)}>Focus</Button></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-white">Milestone Gantt Chart</h2>
          <div className="flex gap-2">{Object.keys(zoomDays).map((item) => <Button key={item} variant={zoom === item ? 'primary' : 'ghost'} onClick={() => setZoom(item)}>{item}</Button>)}</div>
        </div>
        <div className="relative h-96">
          <ResponsiveContainer>
            <BarChart data={ganttData} layout="vertical" margin={{ left: 110, right: 28, top: 10, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
              <XAxis type="number" domain={[minDate, maxDate]} tickFormatter={formatDate} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" width={120} stroke="#cbd5e1" tickLine={false} axisLine={false} />
              <Tooltip labelFormatter={formatDate} contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="start" stackId="a" fill="transparent" />
              <Bar dataKey="duration" stackId="a" radius={[8, 8, 8, 8]} onClick={(row) => setSelectedId(row.id)}>
                {ganttData.map((item) => <Cell key={item.id} fill={statusColors[item.status]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <GanttMarkers data={ganttData} minDate={minDate} maxDate={maxDate} />
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="text-lg font-semibold text-white">Milestone Health</h2><div className="h-72"><ResponsiveContainer><PieChart><Pie data={donutData} dataKey="value" nameKey="status" innerRadius={70} outerRadius={105}>{donutData.map((item) => <Cell key={item.status} fill={statusColors[item.status]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></Card>
        <Card><h2 className="text-lg font-semibold text-white">Completed vs Planned</h2><div className="h-72"><ResponsiveContainer><LineChart data={trend}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} /><Line dataKey="planned" stroke="#06b6d4" strokeDasharray="6 5" /><Line dataKey="completed" stroke="#22c55e" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Card>
      </div>
    </section>
  )
}
