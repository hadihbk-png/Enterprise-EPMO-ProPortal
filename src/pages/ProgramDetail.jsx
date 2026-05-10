import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import NotFound from './NotFound.jsx'
import { getMilestones } from '../services/milestonesService.js'
import { getProgramById } from '../services/programsService.js'
import { getRisks } from '../services/risksService.js'

const tabs = ['Overview', 'Milestones', 'Stage Gates', 'Benefits', 'RAID Log']
const raidTabs = ['Risks', 'Assumptions', 'Issues', 'Dependencies']

const ragColors = {
  Red: '#f43f5e',
  Amber: '#f59e0b',
  Green: '#10b981',
}

const statusColors = {
  'Not Started': '#94a3b8',
  'In Progress': '#06b6d4',
  Complete: '#10b981',
  'At Risk': '#f59e0b',
  Delayed: '#f43f5e',
  Approved: '#10b981',
  Pending: '#f59e0b',
  Failed: '#f43f5e',
}

function money(value) {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function Chip({ children, color }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}20` }}>
      {children}
    </span>
  )
}

function ProgressRing({ value }) {
  const data = [
    { name: 'Complete', value },
    { name: 'Remaining', value: 100 - value },
  ]

  return (
    <div className="relative h-52">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} innerRadius={68} outerRadius={86} startAngle={90} endAngle={-270} dataKey="value" stroke="none" isAnimationActive>
            <Cell fill="#6366f1" />
            <Cell fill="rgba(255,255,255,0.08)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-semibold text-white">{value}%</p>
          <p className="text-xs uppercase tracking-wider text-slate-400">Complete</p>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ program }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-white">{program.name}</h2>
            <p className="mt-1 text-sm text-slate-400">Sponsor: {program.sponsor}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip color={ragColors[program.rag]}>{program.rag}</Chip>
              <Chip color="#6366f1">{program.priority}</Chip>
              <Chip color="#06b6d4">{program.startDate} to {program.endDate}</Chip>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-right">
            <p className="text-xs uppercase tracking-wider text-slate-400">Budget</p>
            <p className="mt-1 text-xl font-semibold text-white">{money(program.budgetAllocated)}</p>
            <p className="mt-1 text-xs text-slate-400">{money(program.budgetSpent)} spent</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="text-sm font-semibold text-white">Strategic Objective</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{program.strategicObjective}</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-white">Progress</h3>
        <ProgressRing value={program.percentComplete} />
        <h3 className="mt-3 text-lg font-semibold text-white">Linked Projects</h3>
        <div className="mt-3 space-y-2">
          {program.linkedProjects.map((project) => (
            <div key={project.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="text-sm text-slate-200">{project.name}</span>
              <Chip color={ragColors[project.rag]}>{project.rag}</Chip>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function MilestonesTab({ program }) {
  const [milestones, setMilestones] = useState(program.milestones)
  const [form, setForm] = useState({ name: '', dueDate: '', owner: '', status: 'Not Started', percentComplete: 0 })

  function addMilestone() {
    if (!form.name) return
    setMilestones((current) => [...current, { ...form, percentComplete: Number(form.percentComplete) }])
    setForm({ name: '', dueDate: '', owner: '', status: 'Not Started', percentComplete: 0 })
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Milestones</h2>
        <Button onClick={addMilestone}><Plus size={17} />Add Milestone</Button>
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-5">
        {['name', 'dueDate', 'owner', 'status', 'percentComplete'].map((field) =>
          field === 'status' ? (
            <select key={field} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              {['Not Started', 'In Progress', 'Complete', 'At Risk', 'Delayed'].map((status) => <option key={status}>{status}</option>)}
            </select>
          ) : (
            <input key={field} type={field === 'dueDate' ? 'date' : field === 'percentComplete' ? 'number' : 'text'} placeholder={field === 'percentComplete' ? '% Complete' : field} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
          ),
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr><th className="p-3">Name</th><th className="p-3">Due Date</th><th className="p-3">Owner</th><th className="p-3">Status</th><th className="p-3">% Complete</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {milestones.map((milestone) => (
              <tr key={`${milestone.name}-${milestone.dueDate}`}>
                <td className="p-3">{milestone.name}</td>
                <td className="p-3">{milestone.dueDate}</td>
                <td className="p-3">{milestone.owner}</td>
                <td className="p-3"><Chip color={statusColors[milestone.status]}>{milestone.status}</Chip></td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-28 rounded-full bg-white/10"><div className="h-2 rounded-full bg-indigo-400" style={{ width: `${milestone.percentComplete}%` }} /></div>
                    <span>{milestone.percentComplete}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function StageGatesTab({ program }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Stage Gates</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {program.stageGates.map((gate, index) => (
          <div key={gate.name} className="relative">
            {index < program.stageGates.length - 1 && <div className="absolute left-1/2 top-8 hidden h-px w-full bg-white/20 lg:block" />}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 h-3 w-3 rounded-full shadow-[0_0_16px_currentColor]" style={{ color: statusColors[gate.status], backgroundColor: statusColors[gate.status] }} />
              <h3 className="font-semibold text-white">{gate.name}</h3>
              <div className="mt-3"><Chip color={statusColors[gate.status]}>{gate.status}</Chip></div>
              <p className="mt-4 text-xs text-slate-400">Sign-off: {gate.signOffDate}</p>
              <p className="mt-1 text-xs text-slate-400">By: {gate.approvedBy}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function BenefitsTab({ program }) {
  const [benefits, setBenefits] = useState(program.benefits)

  function addBenefit() {
    setBenefits((current) => [...current, { description: 'New benefit', plannedValue: 0, achievedValue: 0, unit: 'USD', realisationDate: '2026-12-31' }])
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Benefits</h2>
        <Button onClick={addBenefit}><Plus size={17} />Add Benefit Row</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr><th className="p-3">Benefit Description</th><th className="p-3">Planned</th><th className="p-3">Achieved</th><th className="p-3">Unit</th><th className="p-3">Realisation Date</th><th className="p-3">Variance</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {benefits.map((benefit) => (
              <tr key={`${benefit.description}-${benefit.realisationDate}`}>
                <td className="p-3">{benefit.description}</td>
                <td className="p-3">{benefit.plannedValue.toLocaleString()}</td>
                <td className="p-3">{benefit.achievedValue.toLocaleString()}</td>
                <td className="p-3">{benefit.unit}</td>
                <td className="p-3">{benefit.realisationDate}</td>
                <td className="p-3 text-slate-300">{(benefit.achievedValue - benefit.plannedValue).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function RaidTable({ rows, type }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('title')
  const filteredRows = useMemo(
    () => rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase())).sort((a, b) => String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''))),
    [query, rows, sortKey],
  )
  const columns = type === 'Risks'
    ? ['title', 'category', 'probability', 'impact', 'score', 'owner', 'mitigation', 'status']
    : type === 'Issues'
      ? ['title', 'severity', 'owner', 'raisedDate', 'targetResolution', 'status']
      : ['title', 'category', 'owner', 'status']

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" placeholder={`Filter ${type.toLowerCase()}`} value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
          {columns.filter((column) => column !== 'score').map((column) => <option key={column} value={column}>{column}</option>)}
        </select>
        <Button><Plus size={17} />Add</Button>
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>{columns.map((column) => <th key={column} className="p-3">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {filteredRows.map((row) => (
              <tr key={row.title}>
                {columns.map((column) => {
                  const value = column === 'score' ? row.probability * row.impact : row[column]
                  return <td key={column} className="p-3">{value}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function RaidTab({ program }) {
  const [active, setActive] = useState('Risks')
  const key = active.toLowerCase()
  return (
    <Card>
      <div className="mb-5 flex flex-wrap gap-2">
        {raidTabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActive(tab)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${active === tab ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
            {tab}
          </button>
        ))}
      </div>
      <RaidTable rows={program.raid[key]} type={active} />
    </Card>
  )
}

export default function ProgramDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const [program, setProgram] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getProgramById(id), getMilestones(), getRisks()])
      .then(([programData, milestones, risks]) => {
        setProgram({
          ...programData,
          milestones: milestones.filter((item) => item.programId === id),
          raid: { risks: risks.filter((item) => item.programId === id), assumptions: [], issues: [], dependencies: [] },
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (isLoading) return <LoadingSkeleton rows={4} />
  if (error) return <Card className="text-rose-200">{error}</Card>
  if (!program) return <NotFound />

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Link to="/programs" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200">
          <ArrowLeft size={17} />
          Back to Programs
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">Program Detail</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{program.name}</h1>
          </div>
          <Chip color={ragColors[program.rag]}>{program.rag}</Chip>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`min-w-fit rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/10'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && <OverviewTab program={program} />}
      {activeTab === 'Milestones' && <MilestonesTab program={program} />}
      {activeTab === 'Stage Gates' && <StageGatesTab program={program} />}
      {activeTab === 'Benefits' && <BenefitsTab program={program} />}
      {activeTab === 'RAID Log' && <RaidTab program={program} />}
    </section>
  )
}
