import { useEffect, useMemo, useState } from 'react'
import { Bell, Edit3, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { getPrograms } from '../services/programsService.js'
import { createRisk, deleteRisk, getRisks, updateRisk } from '../services/risksService.js'

const today = new Date('2026-05-10')
const riskCategories = ['Strategic', 'Operational', 'Financial', 'Regulatory', 'Technical']
const riskStatuses = ['Open', 'In Progress', 'Closed', 'Accepted']
const issueSeverities = ['Critical', 'High', 'Medium', 'Low']
const issueStatuses = ['Open', 'In Progress', 'Escalated', 'Resolved']

const severityColors = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
}

function scoreColor(score) {
  if (score <= 6) return '#22c55e'
  if (score <= 12) return '#eab308'
  if (score <= 19) return '#f97316'
  return '#ef4444'
}

function Chip({ children, color }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-300" style={{ color, backgroundColor: `${color}20` }}>
      {children}
    </span>
  )
}

function Select({ value, onChange, children }) {
  return <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
}

function Drawer({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white">Close</button>
        </div>
        {children}
      </motion.aside>
    </div>
  )
}

function RiskDrawer({ form, setForm, onSave, onClose, programs }) {
  const score = form.probability * form.impact
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none'
  return (
    <Drawer title="Add Risk" onClose={onClose}>
      <div className="space-y-4">
        <input className={inputClass} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <Select value={form.program} onChange={(program) => setForm({ ...form, program })}>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
        <Select value={form.category} onChange={(category) => setForm({ ...form, category })}>{riskCategories.map((category) => <option key={category}>{category}</option>)}</Select>
        <label className="block text-sm text-slate-300">Probability: {form.probability}<input type="range" min="1" max="5" value={form.probability} onChange={(event) => setForm({ ...form, probability: Number(event.target.value) })} className="mt-2 w-full" /></label>
        <label className="block text-sm text-slate-300">Impact: {form.impact}<input type="range" min="1" max="5" value={form.impact} onChange={(event) => setForm({ ...form, impact: Number(event.target.value) })} className="mt-2 w-full" /></label>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <span className="text-sm text-slate-300">Calculated Score</span>
          <Chip color={scoreColor(score)}>{score}</Chip>
        </div>
        <input className={inputClass} placeholder="Owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
        <textarea className={`${inputClass} min-h-28`} placeholder="Mitigation Plan" value={form.mitigation} onChange={(event) => setForm({ ...form, mitigation: event.target.value })} />
        <Select value={form.status} onChange={(status) => setForm({ ...form, status })}>{riskStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
        <Button className="w-full" onClick={onSave}>Save Risk</Button>
      </div>
    </Drawer>
  )
}

function IssueDrawer({ form, setForm, onSave, onClose, programs }) {
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none'
  return (
    <Drawer title="Add Issue" onClose={onClose}>
      <div className="space-y-4">
        <input className={inputClass} placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <Select value={form.program} onChange={(program) => setForm({ ...form, program })}>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
        <Select value={form.severity} onChange={(severity) => setForm({ ...form, severity })}>{issueSeverities.map((severity) => <option key={severity}>{severity}</option>)}</Select>
        <input className={inputClass} placeholder="Owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
        <input type="date" className={inputClass} value={form.raisedDate} onChange={(event) => setForm({ ...form, raisedDate: event.target.value })} />
        <input type="date" className={inputClass} value={form.targetResolution} onChange={(event) => setForm({ ...form, targetResolution: event.target.value })} />
        <Select value={form.status} onChange={(status) => setForm({ ...form, status })}>{issueStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
        <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.escalated} onChange={(event) => setForm({ ...form, escalated: event.target.checked })} /> Escalated</label>
        <Button className="w-full" onClick={onSave}>Save Issue</Button>
      </div>
    </Drawer>
  )
}

function DeleteConfirm({ label, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-white">Delete {label}</h2>
        <p className="mt-3 text-sm text-slate-300">This removes the item from the current mock session.</p>
        <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button className="bg-rose-500 hover:bg-rose-400" onClick={onConfirm}>Delete</Button></div>
      </Card>
    </div>
  )
}

function Heatmap({ risks, selectedCell, setSelectedCell }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Risk Heatmap</h2>
      <div className="mt-4 grid grid-cols-[44px_repeat(5,minmax(0,1fr))] gap-2">
        <div />
        {[1, 2, 3, 4, 5].map((impact) => <div key={impact} className="text-center text-xs text-slate-400">I{impact}</div>)}
        {[5, 4, 3, 2, 1].map((probability) => (
          <div key={`row-${probability}`} className="contents">
            <div className="grid place-items-center text-xs text-slate-400">P{probability}</div>
            {[1, 2, 3, 4, 5].map((impact) => {
              const cellRisks = risks.filter((risk) => risk.probability === probability && risk.impact === impact)
              const selected = selectedCell?.probability === probability && selectedCell?.impact === impact
              return (
                <button
                  type="button"
                  key={`${probability}-${impact}`}
                  onClick={() => setSelectedCell(selected ? null : { probability, impact })}
                  className={`relative min-h-20 rounded-xl border border-white/10 p-2 text-left transition hover:scale-[1.03] hover:animate-pulse ${selected ? 'ring-2 ring-white/70' : ''}`}
                  style={{ backgroundColor: `${scoreColor(probability * impact)}55` }}
                >
                  <span className="text-sm font-semibold text-white">{cellRisks.length}</span>
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {cellRisks.map((risk) => <span key={risk.id} className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />)}
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}

function RisksTab({ risks, setRisks, programs }) {
  const [filters, setFilters] = useState({ program: 'All', category: 'All', owner: 'All', status: 'All', scoreMax: 25 })
  const [sortKey, setSortKey] = useState('id')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedCell, setSelectedCell] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const owners = [...new Set(risks.map((risk) => risk.owner))]
  const emptyRisk = { title: '', program: programs[0]?.name ?? '', category: 'Strategic', probability: 3, impact: 3, owner: '', mitigation: '', status: 'Open' }
  const [form, setForm] = useState(emptyRisk)

  const filtered = useMemo(() => risks
    .filter((risk) => filters.program === 'All' || risk.program === filters.program)
    .filter((risk) => filters.category === 'All' || risk.category === filters.category)
    .filter((risk) => filters.owner === 'All' || risk.owner === filters.owner)
    .filter((risk) => filters.status === 'All' || risk.status === filters.status)
    .filter((risk) => risk.probability * risk.impact <= filters.scoreMax)
    .filter((risk) => !selectedCell || (risk.probability === selectedCell.probability && risk.impact === selectedCell.impact))
    .sort((a, b) => String(sortKey === 'score' ? a.probability * a.impact : a[sortKey]).localeCompare(String(sortKey === 'score' ? b.probability * b.impact : b[sortKey]))),
  [filters, risks, selectedCell, sortKey])

  async function saveRisk() {
    const payload = { ...form, programId: programs.find((program) => program.name === form.program)?.id ?? form.programId }
    if (editingId) {
      const saved = await updateRisk(editingId, payload)
      setRisks((current) => current.map((risk) => risk.id === editingId ? saved : risk))
    } else {
      const saved = await createRisk(payload)
      setRisks((current) => [saved, ...current])
    }
    setEditingId(null)
    setDrawerOpen(false)
    setForm(emptyRisk)
  }

  return (
    <div className="space-y-4">
      <Heatmap risks={risks} selectedCell={selectedCell} setSelectedCell={setSelectedCell} />
      <Card>
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="grid gap-3 md:grid-cols-5">
            <Select value={filters.program} onChange={(program) => setFilters({ ...filters, program })}><option>All</option>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
            <Select value={filters.category} onChange={(category) => setFilters({ ...filters, category })}><option>All</option>{riskCategories.map((category) => <option key={category}>{category}</option>)}</Select>
            <Select value={filters.owner} onChange={(owner) => setFilters({ ...filters, owner })}><option>All</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</Select>
            <Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })}><option>All</option>{riskStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
            <label className="text-xs text-slate-400">Score {'<='} {filters.scoreMax}<input type="range" min="1" max="25" value={filters.scoreMax} onChange={(event) => setFilters({ ...filters, scoreMax: Number(event.target.value) })} className="mt-2 w-full" /></label>
          </div>
          <Button onClick={() => { setForm(emptyRisk); setDrawerOpen(true) }}><Plus size={17} />Add Risk</Button>
        </div>
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['id', 'title', 'program', 'category', 'probability', 'impact', 'score', 'owner', 'mitigation', 'status', 'actions'].map((column) => <th key={column} className="p-3"><button type="button" onClick={() => setSortKey(column)}>{column}</button></th>)}</tr></thead>
            <motion.tbody key={filtered.map((risk) => risk.id).join('-')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-white/10 text-slate-200">
              {filtered.map((risk) => {
                const score = risk.probability * risk.impact
                return (
                  <tr key={risk.id}>
                    <td className="p-3">{risk.id}</td><td className="p-3">{risk.title}</td><td className="p-3">{risk.program}</td><td className="p-3">{risk.category}</td>
                    <td className="p-3">{risk.probability}</td><td className="p-3">{risk.impact}</td><td className="p-3"><Chip color={scoreColor(score)}>{score}</Chip></td>
                    <td className="p-3">{risk.owner}</td><td className="p-3">{risk.mitigation}</td><td className="p-3">{risk.status}</td>
                    <td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => { setEditingId(risk.id); setForm(risk); setDrawerOpen(true) }}><Edit3 size={16} /></button><button type="button" className="text-rose-300" onClick={() => setDeleteTarget(risk)}><Trash2 size={16} /></button></div></td>
                  </tr>
                )
              })}
            </motion.tbody>
          </table>
        </div>
      </Card>
      {drawerOpen && <RiskDrawer form={form} setForm={setForm} onSave={saveRisk} onClose={() => setDrawerOpen(false)} programs={programs} />}
      {deleteTarget && <DeleteConfirm label="Risk" onCancel={() => setDeleteTarget(null)} onConfirm={() => { deleteRisk(deleteTarget.id).then(() => setRisks((current) => current.filter((risk) => risk.id !== deleteTarget.id))); setDeleteTarget(null) }} />}
    </div>
  )
}

function IssuesTab({ issues, setIssues, programs }) {
  const [filters, setFilters] = useState({ program: 'All', severity: 'All', status: 'All', overdue: false })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const emptyIssue = { title: '', program: programs[0]?.name ?? '', severity: 'Medium', owner: '', raisedDate: '2026-05-10', targetResolution: '2026-05-20', status: 'Open', escalated: false }
  const [form, setForm] = useState(emptyIssue)
  const filtered = issues
    .filter((issue) => filters.program === 'All' || issue.program === filters.program)
    .filter((issue) => filters.severity === 'All' || issue.severity === filters.severity)
    .filter((issue) => filters.status === 'All' || issue.status === filters.status)
    .filter((issue) => !filters.overdue || (new Date(issue.targetResolution) < today && issue.status !== 'Resolved'))

  function saveIssue() {
    setIssues((current) => [{ id: `I-${String(current.length + 1).padStart(3, '0')}`, ...form }, ...current])
    setDrawerOpen(false)
    setForm(emptyIssue)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="grid gap-3 md:grid-cols-4">
          <Select value={filters.program} onChange={(program) => setFilters({ ...filters, program })}><option>All</option>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
          <Select value={filters.severity} onChange={(severity) => setFilters({ ...filters, severity })}><option>All</option>{issueSeverities.map((severity) => <option key={severity}>{severity}</option>)}</Select>
          <Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })}><option>All</option>{issueStatuses.map((status) => <option key={status}>{status}</option>)}</Select>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={filters.overdue} onChange={(event) => setFilters({ ...filters, overdue: event.target.checked })} /> Overdue</label>
        </div>
        <Button onClick={() => setDrawerOpen(true)}><Plus size={17} />Add Issue</Button>
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['Issue ID', 'Title', 'Program', 'Severity', 'Owner', 'Raised Date', 'Target Resolution', 'Status', 'Escalated'].map((column) => <th key={column} className="p-3">{column}</th>)}</tr></thead>
          <motion.tbody key={filtered.map((issue) => issue.id).join('-')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="divide-y divide-white/10 text-slate-200">
            {filtered.map((issue) => {
              const overdue = new Date(issue.targetResolution) < today && issue.status !== 'Resolved'
              return (
                <tr key={issue.id} className={overdue ? 'bg-rose-500/10' : ''}>
                  <td className="p-3">{issue.id}</td><td className="p-3">{issue.title}</td><td className="p-3">{issue.program}</td>
                  <td className="p-3"><Chip color={severityColors[issue.severity]}>{issue.severity}</Chip></td><td className="p-3">{issue.owner}</td>
                  <td className="p-3">{issue.raisedDate}</td><td className="p-3">{issue.targetResolution}</td><td className="p-3">{issue.status}</td>
                  <td className="p-3">{issue.escalated ? <Bell size={17} className="text-rose-400" /> : <span className="text-slate-500">-</span>}</td>
                </tr>
              )
            })}
          </motion.tbody>
        </table>
      </div>
      {drawerOpen && <IssueDrawer form={form} setForm={setForm} onSave={saveIssue} onClose={() => setDrawerOpen(false)} programs={programs} />}
    </Card>
  )
}

export default function RisksIssues() {
  const [activeTab, setActiveTab] = useState('RISKS')
  const [risks, setRisks] = useState([])
  const [issues, setIssues] = useState([])
  const [programs, setPrograms] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([getPrograms(), getRisks()])
      .then(([programData, riskData]) => {
        setPrograms(programData)
        setRisks(riskData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
  const stats = {
    total: risks.length,
    critical: risks.filter((risk) => risk.probability * risk.impact >= 20).length,
    high: risks.filter((risk) => risk.probability * risk.impact >= 15 && risk.probability * risk.impact <= 19).length,
    openIssues: issues.filter((issue) => issue.status !== 'Resolved').length,
    overdue: issues.filter((issue) => new Date(issue.targetResolution) < today && issue.status !== 'Resolved').length,
  }

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl">
      {error && <Card className="mb-4 text-rose-200">{error}</Card>}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">Control Tower</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Risk & Issue Management</h1>
      </div>
      <Card className="mb-4">
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            ['Total Risks', stats.total],
            ['Critical', stats.critical],
            ['High', stats.high],
            ['Open Issues', stats.openIssues],
            ['Overdue Issues', stats.overdue],
          ].map(([label, value]) => (
            <div key={label}><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p></div>
          ))}
        </div>
      </Card>
      <div className="mb-4 flex gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        {['RISKS', 'ISSUES'].map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === tab ? 'bg-rose-500 text-white' : 'text-slate-300 hover:bg-white/10'}`}>{tab}</button>)}
      </div>
      {activeTab === 'RISKS' ? <RisksTab risks={risks} setRisks={setRisks} programs={programs} /> : <IssuesTab issues={issues} setIssues={setIssues} programs={programs} />}
    </section>
  )
}
