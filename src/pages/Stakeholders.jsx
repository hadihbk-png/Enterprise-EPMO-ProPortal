import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { Edit3, FileDown, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { getPrograms } from '../services/programsService.js'
import { createStakeholder, deleteStakeholder, getStakeholders, updateStakeholder } from '../services/stakeholdersService.js'

const engagementActivities = {}
const communicationPlan = []

const today = new Date('2026-05-10')
const levels = ['High', 'Medium', 'Low']
const attitudes = ['Champion', 'Neutral', 'Resistant']
const contactMethods = ['Email', 'Meeting', 'Report', 'Call']
const attitudeColors = { Champion: '#22c55e', Neutral: '#f59e0b', Resistant: '#f43f5e' }
const levelColors = { High: '#6366f1', Medium: '#06b6d4', Low: '#94a3b8' }

function Chip({ children, color }) {
  return <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}20` }}>{children}</span>
}

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

function dueDate(lastContact, frequency) {
  const days = { Daily: 1, Weekly: 7, Fortnightly: 14, Monthly: 30 }[frequency]
  return addDays(lastContact, days)
}

function Select({ value, onChange, children }) {
  return <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
}

function Drawer({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950/95 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={onClose}>Close</button>
        </div>
        {children}
      </motion.aside>
    </div>
  )
}

function StakeholderDrawer({ form, setForm, onSave, onClose, programs }) {
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none'
  return (
    <Drawer title="Stakeholder" onClose={onClose}>
      <div className="space-y-4">
        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className={inputClass} placeholder="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
        <input className={inputClass} placeholder="Organization" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} />
        <Select value={form.program} onChange={(program) => setForm({ ...form, program })}>{programs.map((program) => <option key={program.id}>{program.name}</option>)}</Select>
        <Select value={form.influence} onChange={(influence) => setForm({ ...form, influence })}>{levels.map((level) => <option key={level}>{level}</option>)}</Select>
        <Select value={form.interest} onChange={(interest) => setForm({ ...form, interest })}>{levels.map((level) => <option key={level}>{level}</option>)}</Select>
        <Select value={form.attitude} onChange={(attitude) => setForm({ ...form, attitude })}>{attitudes.map((attitude) => <option key={attitude}>{attitude}</option>)}</Select>
        <Select value={form.engagementMethod} onChange={(engagementMethod) => setForm({ ...form, engagementMethod })}>{contactMethods.map((method) => <option key={method}>{method}</option>)}</Select>
        <input type="date" className={inputClass} value={form.lastContact} onChange={(event) => setForm({ ...form, lastContact: event.target.value })} />
        <textarea className={`${inputClass} min-h-24`} placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <Button className="w-full" onClick={onSave}>Save Stakeholder</Button>
      </div>
    </Drawer>
  )
}

function Register({ stakeholders, setStakeholders, selectedId, setSelectedId, programs }) {
  const emptyForm = { name: '', role: '', organization: '', program: programs[0]?.name ?? '', influence: 'Medium', interest: 'Medium', attitude: 'Neutral', engagementMethod: 'Email', lastContact: '2026-05-10', notes: '' }
  const [filters, setFilters] = useState({ attitude: 'All', influence: 'All', search: '' })
  const [sortKey, setSortKey] = useState('name')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const rows = useMemo(() => stakeholders
    .filter((item) => filters.attitude === 'All' || item.attitude === filters.attitude)
    .filter((item) => filters.influence === 'All' || item.influence === filters.influence)
    .filter((item) => item.name.toLowerCase().includes(filters.search.toLowerCase()))
    .sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey]))),
  [filters, sortKey, stakeholders])

  async function save() {
    const payload = { ...form, programId: programs.find((program) => program.name === form.program)?.id ?? form.programId }
    if (editingId) {
      const saved = await updateStakeholder(editingId, payload)
      setStakeholders((current) => current.map((item) => item.id === editingId ? saved : item))
    } else {
      const saved = await createStakeholder(payload)
      setStakeholders((current) => [saved, ...current])
    }
    setDrawerOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={filters.attitude} onChange={(attitude) => setFilters({ ...filters, attitude })}><option>All</option>{attitudes.map((attitude) => <option key={attitude}>{attitude}</option>)}</Select>
          <Select value={filters.influence} onChange={(influence) => setFilters({ ...filters, influence })}><option>All</option>{levels.map((level) => <option key={level}>{level}</option>)}</Select>
          <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" placeholder="Search stakeholders" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setDrawerOpen(true) }}><Plus size={17} />Add Stakeholder</Button>
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[1060px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>{['name', 'role', 'organization', 'influence', 'interest', 'attitude', 'engagementMethod', 'lastContact', 'actions'].map((column) => <th key={column} className="p-3"><button type="button" onClick={() => setSortKey(column)}>{column}</button></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {rows.map((item) => (
              <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer transition ${selectedId === item.id ? 'bg-indigo-500/15' : 'hover:bg-white/[0.04]'}`}>
                <td className="p-3 font-semibold text-white">{item.name}</td>
                <td className="p-3">{item.role}</td>
                <td className="p-3">{item.organization}</td>
                <td className="p-3"><Chip color={levelColors[item.influence]}>{item.influence}</Chip></td>
                <td className="p-3"><Chip color={levelColors[item.interest]}>{item.interest}</Chip></td>
                <td className="p-3"><Chip color={attitudeColors[item.attitude]}>{item.attitude}</Chip></td>
                <td className="p-3">{item.engagementMethod}</td>
                <td className="p-3">{item.lastContact}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={(event) => { event.stopPropagation(); setEditingId(item.id); setForm(item); setDrawerOpen(true) }}><Edit3 size={16} /></button>
                    <button type="button" className="text-rose-300" onClick={(event) => { event.stopPropagation(); setDeleteTarget(item) }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {drawerOpen && <StakeholderDrawer form={form} setForm={setForm} onSave={save} onClose={() => setDrawerOpen(false)} programs={programs} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-white">Delete Stakeholder</h2>
            <p className="mt-3 text-sm text-slate-300">Remove {deleteTarget.name} from this mock register?</p>
            <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="bg-rose-500 hover:bg-rose-400" onClick={() => { deleteStakeholder(deleteTarget.id).then(() => setStakeholders((current) => current.filter((item) => item.id !== deleteTarget.id))); setDeleteTarget(null) }}>Delete</Button></div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function PowerInterestGrid({ stakeholders, selectedId, setSelectedId }) {
  const position = { Low: 18, Medium: 50, High: 82 }
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Power / Interest Grid</h2>
      <div className="relative mt-4 h-[420px] overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-center text-sm font-semibold">
          <div className="grid place-items-center bg-amber-400/[0.08] text-amber-200/70">Keep Satisfied</div>
          <div className="grid place-items-center bg-indigo-400/[0.09] text-indigo-200/80">Manage Closely</div>
          <div className="grid place-items-center bg-slate-400/[0.07] text-slate-300/70">Monitor</div>
          <div className="grid place-items-center bg-cyan-400/[0.08] text-cyan-200/70">Keep Informed</div>
        </div>
        <div className="absolute inset-x-5 bottom-4 flex justify-between text-xs text-slate-300"><span>Interest Low</span><span>Interest High</span></div>
        <div className="absolute left-4 top-5 text-xs text-slate-300">Influence High</div>
        <div className="absolute bottom-10 left-4 text-xs text-slate-300">Influence Low</div>
        {stakeholders.map((item, index) => {
          const left = position[item.interest] + (index % 2) * 2 - 1
          const top = 100 - position[item.influence] + (index % 3) * 2 - 2
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              title={`${item.name} | ${item.role} | ${item.attitude} | Last contact ${item.lastContact}`}
              className={`absolute grid h-11 w-11 place-items-center rounded-full border text-xs font-bold text-white shadow-2xl transition hover:scale-110 ${selectedId === item.id ? 'ring-2 ring-white' : ''}`}
              style={{ left: `${left}%`, top: `${top}%`, backgroundColor: attitudeColors[item.attitude], borderColor: 'rgba(255,255,255,0.65)' }}
            >
              {initials(item.name)}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function EngagementTracker({ stakeholders, activities, setActivities }) {
  const [stakeholderId, setStakeholderId] = useState(stakeholders[0]?.id)
  const [timeline, setTimeline] = useState(false)
  const [form, setForm] = useState({ date: '2026-05-10', type: 'Meeting', summary: '', outcome: '', nextAction: '', loggedBy: 'PMO' })
  const selected = stakeholders.find((item) => item.id === stakeholderId) ?? stakeholders[0]
  const rows = activities[selected?.id] ?? []

  function addActivity() {
    if (!form.summary || !selected) return
    setActivities((current) => ({ ...current, [selected.id]: [form, ...(current[selected.id] ?? [])] }))
    setForm({ date: '2026-05-10', type: 'Meeting', summary: '', outcome: '', nextAction: '', loggedBy: 'PMO' })
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Engagement Tracker</h2>
          <p className="mt-1 text-sm text-slate-400">Per-stakeholder activity history.</p>
        </div>
        <div className="flex gap-2">
          <Select value={selected?.id} onChange={setStakeholderId}>{stakeholders.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select>
          <Button variant={timeline ? 'primary' : 'ghost'} onClick={() => setTimeline((value) => !value)}>Timeline</Button>
        </div>
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        <Select value={form.type} onChange={(type) => setForm({ ...form, type })}>{['Meeting', 'Email', 'Workshop', 'Phone Call', 'Presentation'].map((type) => <option key={type}>{type}</option>)}</Select>
        <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Summary" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
        <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Outcome" value={form.outcome} onChange={(event) => setForm({ ...form, outcome: event.target.value })} />
        <input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Next Action" value={form.nextAction} onChange={(event) => setForm({ ...form, nextAction: event.target.value })} />
        <Button onClick={addActivity}><Plus size={17} />Add Activity</Button>
      </div>
      {timeline ? (
        <div className="space-y-4 border-l border-white/15 pl-5">
          {rows.map((row) => <div key={`${row.date}-${row.summary}`} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3"><span className="absolute -left-[27px] top-4 h-3 w-3 rounded-full bg-amber-300" /><p className="text-sm font-semibold text-white">{formatDate(row.date)} | {row.type}</p><p className="mt-1 text-sm text-slate-300">{row.summary}</p><p className="mt-1 text-xs text-slate-400">Next: {row.nextAction}</p></div>)}
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['Date', 'Type', 'Summary', 'Outcome', 'Next Action', 'Logged By'].map((column) => <th key={column} className="p-3">{column}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/10 text-slate-200">{rows.map((row) => <tr key={`${row.date}-${row.summary}`}><td className="p-3">{row.date}</td><td className="p-3">{row.type}</td><td className="p-3">{row.summary}</td><td className="p-3">{row.outcome}</td><td className="p-3">{row.nextAction}</td><td className="p-3">{row.loggedBy}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function CommunicationPlan({ stakeholders, plan }) {
  const rows = plan.map((item) => {
    const stakeholder = stakeholders.find((entry) => entry.id === item.stakeholderId)
    const nextDue = stakeholder ? dueDate(stakeholder.lastContact, item.frequency) : today
    return { ...item, stakeholder, nextDue, overdue: nextDue < today }
  })

  function exportPdf() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('ProPortal Communication Plan', 14, 18)
    doc.setFontSize(10)
    rows.forEach((row, index) => {
      const y = 32 + index * 22
      doc.text(`${row.stakeholder?.name ?? 'Unknown'} | Tier ${row.tier} | ${row.frequency} | ${row.format}`, 14, y)
      doc.text(`Owner: ${row.owner} | Next Due: ${formatDate(row.nextDue)}`, 14, y + 6)
      doc.text(`Message: ${row.keyMessage}`, 14, y + 12)
    })
    doc.save('proportal-communication-plan.pdf')
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Communication Plan</h2>
        <Button onClick={exportPdf}><FileDown size={17} />Export to PDF</Button>
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['Stakeholder', 'Tier', 'Frequency', 'Format', 'Key Message', 'Owner', 'Next Due'].map((column) => <th key={column} className="p-3">{column}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {rows.map((row) => <tr key={row.stakeholderId}><td className="p-3 font-semibold text-white">{row.stakeholder?.name}</td><td className="p-3">{row.tier}</td><td className="p-3">{row.frequency}</td><td className="p-3">{row.format}</td><td className="p-3">{row.keyMessage}</td><td className="p-3">{row.owner}</td><td className="p-3"><div className="flex items-center gap-2"><span>{formatDate(row.nextDue)}</span>{row.overdue && <Chip color="#f43f5e">Overdue</Chip>}</div></td></tr>)}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function Stakeholders() {
  const [stakeholders, setStakeholders] = useState([])
  const [programs, setPrograms] = useState([])
  const [activities, setActivities] = useState(engagementActivities)
  const [selectedId, setSelectedId] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([getPrograms(), getStakeholders()])
      .then(([programData, stakeholderData]) => {
        setPrograms(programData)
        setStakeholders(stakeholderData)
        setSelectedId(stakeholderData[0]?.id ?? null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
  const stats = {
    total: stakeholders.length,
    champions: stakeholders.filter((item) => item.attitude === 'Champion').length,
    neutral: stakeholders.filter((item) => item.attitude === 'Neutral').length,
    resistant: stakeholders.filter((item) => item.attitude === 'Resistant').length,
    highInfluence: stakeholders.filter((item) => item.influence === 'High').length,
  }

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      {error && <Card className="text-rose-200">{error}</Card>}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Engagement</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Stakeholder Management</h1>
      </div>
      <Card>
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            ['Total Stakeholders', stats.total],
            ['Champions', stats.champions],
            ['Neutral', stats.neutral],
            ['Resistant', stats.resistant],
            ['High Influence', stats.highInfluence],
          ].map(([label, value]) => <div key={label}><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p></div>)}
        </div>
      </Card>
      <Register stakeholders={stakeholders} setStakeholders={setStakeholders} selectedId={selectedId} setSelectedId={setSelectedId} programs={programs} />
      <PowerInterestGrid stakeholders={stakeholders} selectedId={selectedId} setSelectedId={setSelectedId} />
      <EngagementTracker stakeholders={stakeholders} activities={activities} setActivities={setActivities} />
      <CommunicationPlan stakeholders={stakeholders} plan={communicationPlan} />
    </section>
  )
}
