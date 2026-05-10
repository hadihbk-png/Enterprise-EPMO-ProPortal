import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import PageWrapper from '../components/layout/PageWrapper.jsx'
import { getBudgetRecords } from '../services/budgetService.js'
import { getMilestones } from '../services/milestonesService.js'
import { getPrograms } from '../services/programsService.js'
import { getRisks } from '../services/risksService.js'

const ragColors = { Red: '#f43f5e', Amber: '#f59e0b', Green: '#10b981' }

function money(value) {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value)
}

export default function Dashboard() {
  const [state, setState] = useState({ programs: [], risks: [], milestones: [], budget: [], isLoading: true, error: '' })

  useEffect(() => {
    Promise.all([getPrograms(), getRisks(), getMilestones(), getBudgetRecords()])
      .then(([programs, risks, milestones, budget]) => setState({ programs, risks, milestones, budget, isLoading: false, error: '' }))
      .catch((error) => setState((current) => ({ ...current, isLoading: false, error: error.message })))
  }, [])

  const budgetTrend = useMemo(() => {
    const byMonth = new Map()
    state.budget.forEach((record) => {
      const month = record.month?.slice(0, 7) ?? 'Unscheduled'
      const current = byMonth.get(month) ?? { month, planned: 0, actual: 0 }
      current.planned += record.planned
      current.actual += record.actual
      byMonth.set(month, current)
    })
    return [...byMonth.values()]
  }, [state.budget])

  const ragSummary = ['Red', 'Amber', 'Green'].map((status) => ({
    status,
    count: state.programs.filter((program) => program.rag === status).length,
    color: ragColors[status],
  }))
  const totalBudget = state.programs.reduce((sum, program) => sum + program.budgetAllocated, 0)
  const actualSpend = state.budget.reduce((sum, record) => sum + record.actual, 0)
  const dueMilestones = state.milestones.filter((item) => item.status !== 'Complete').slice(0, 5)
  const topRisks = [...state.risks].sort((a, b) => b.score - a.score).slice(0, 5)

  if (state.isLoading) return <LoadingSkeleton rows={5} />

  return (
    <PageWrapper title="Executive Dashboard" eyebrow="Command Center" description="Live portfolio health from Supabase." accent="var(--color-programs)">
      {state.error && <Card className="mb-4 text-rose-200">{state.error}</Card>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total Programs', state.programs.length],
          ['Active Projects', state.programs.length],
          ['Budget Utilisation', totalBudget ? `${Math.round((actualSpend / totalBudget) * 100)}%` : '0%'],
          ['Open Risks', state.risks.filter((risk) => risk.status !== 'Closed').length],
          ['Milestones Due', dueMilestones.length],
        ].map(([label, value]) => <Card key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold text-white">{value}</p></Card>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">Budget Burn</h2>
          <div className="mt-4 h-80"><ResponsiveContainer><AreaChart data={budgetTrend}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" tickFormatter={money} /><Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={money} /><Area dataKey="planned" stroke="#06b6d4" fill="#06b6d433" strokeDasharray="6 5" /><Area dataKey="actual" stroke="#6366f1" fill="#6366f144" /></AreaChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">RAG Status Summary</h2>
          <div className="mt-8 grid grid-cols-3 gap-3">{ragSummary.map((item) => <div key={item.status} className={`grid h-24 place-items-center rounded-full border ${item.status === 'Red' ? 'animate-pulse' : ''}`} style={{ borderColor: item.color, backgroundColor: `${item.color}20` }}><div className="text-center"><p className="text-3xl font-semibold text-white">{item.count}</p><p className="text-xs font-semibold" style={{ color: item.color }}>{item.status}</p></div></div>)}</div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card><div className="mb-4 flex justify-between"><h2 className="text-lg font-semibold text-white">Top Risks</h2><Link className="text-sm text-rose-300" to="/risks">View All</Link></div>{topRisks.map((risk) => <div key={risk.id} className="flex justify-between border-t border-white/10 py-3 text-sm text-slate-200"><span>{risk.title}</span><span>{risk.score}</span></div>)}</Card>
        <Card><h2 className="text-lg font-semibold text-white">Upcoming Milestones</h2>{dueMilestones.map((item) => <div key={item.id} className="flex justify-between border-t border-white/10 py-3 text-sm text-slate-200"><span>{item.name}</span><span>{item.plannedDate}</span></div>)}</Card>
      </div>
    </PageWrapper>
  )
}
