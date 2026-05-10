import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { createProgram, deleteProgram, getPrograms, updateProgram } from '../services/programsService.js'

const ragColors = {
  Red: '#f43f5e',
  Amber: '#f59e0b',
  Green: '#10b981',
}

const priorities = ['Critical', 'High', 'Medium', 'Low']
const statuses = ['Red', 'Amber', 'Green']

const emptyForm = {
  name: '',
  sponsor: '',
  strategicObjective: '',
  startDate: '',
  endDate: '',
  budgetAllocated: '',
  priority: 'High',
  rag: 'Green',
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

function Field({ label, children }) {
  return (
    <label className="space-y-1.5 text-sm text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  )
}

function ProgramModal({ form, setForm, onClose, onSave, title }) {
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-300/70'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white">
            Close
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Sponsor">
            <input className={inputClass} value={form.sponsor} onChange={(event) => setForm({ ...form, sponsor: event.target.value })} />
          </Field>
          <Field label="Strategic Objective">
            <textarea className={`${inputClass} min-h-24 sm:col-span-2`} value={form.strategicObjective} onChange={(event) => setForm({ ...form, strategicObjective: event.target.value })} />
          </Field>
          <Field label="Start Date">
            <input type="date" className={inputClass} value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
          </Field>
          <Field label="End Date">
            <input type="date" className={inputClass} value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
          </Field>
          <Field label="Budget Allocated">
            <input type="number" className={inputClass} value={form.budgetAllocated} onChange={(event) => setForm({ ...form, budgetAllocated: event.target.value })} />
          </Field>
          <Field label="Priority">
            <select className={inputClass} value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.rag} onChange={(event) => setForm({ ...form, rag: event.target.value })}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Program</Button>
        </div>
      </Card>
    </div>
  )
}

function DeleteModal({ program, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-white">Delete Program</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Delete "{program.name}" from the register? This action only affects the current mock session.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button className="bg-rose-500 hover:bg-rose-400" onClick={onConfirm}>Delete</Button>
        </div>
      </Card>
    </div>
  )
}

export default function Programs() {
  const [items, setItems] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: 'All', priority: 'All', search: '' })
  const [modalMode, setModalMode] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    getPrograms()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredPrograms = useMemo(
    () =>
      items.filter((program) => {
        const matchesStatus = filters.status === 'All' || program.rag === filters.status
        const matchesPriority = filters.priority === 'All' || program.priority === filters.priority
        const matchesSearch = program.name.toLowerCase().includes(filters.search.toLowerCase())
        return matchesStatus && matchesPriority && matchesSearch
      }),
    [filters, items],
  )

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode('new')
  }

  function openEdit(program) {
    setForm({
      name: program.name,
      sponsor: program.sponsor,
      strategicObjective: program.strategicObjective,
      startDate: program.startDate,
      endDate: program.endDate,
      budgetAllocated: program.budgetAllocated,
      priority: program.priority,
      rag: program.rag,
    })
    setEditingId(program.id)
    setModalMode('edit')
  }

  async function saveProgram() {
    const payload = {
      ...form,
      budgetAllocated: Number(form.budgetAllocated || 0),
      budgetSpent: 0,
      percentComplete: 0,
      linkedProjects: [],
      milestones: [],
      stageGates: [],
      benefits: [],
      raid: { risks: [], assumptions: [], issues: [], dependencies: [] },
    }
    if (editingId) {
      const saved = await updateProgram(editingId, payload)
      setItems((current) => current.map((program) => (program.id === editingId ? saved : program)))
    } else {
      const saved = await createProgram(payload)
      setItems((current) => [saved, ...current])
    }
    setModalMode(null)
  }

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl">
      {error && <Card className="mb-4 text-rose-200">{error}</Card>}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">Delivery Portfolio</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Programs</h1>
        </div>
        <Button onClick={openNew}>
          <Plus size={18} />
          New Program
        </Button>
      </div>

      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-[180px_180px_1fr]">
          <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option>All</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}>
            <option>All</option>
            {priorities.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-400">
            <Search size={18} />
            <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search by name" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="flex min-h-[320px] flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{program.name}</h2>
                <p className="mt-1 text-sm text-slate-400">Sponsor: {program.sponsor}</p>
              </div>
              <Chip color={ragColors[program.rag]}>{program.rag}</Chip>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip color="#6366f1">{program.priority}</Chip>
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-300">{money(program.budgetAllocated)}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between gap-3"><span>Start</span><span>{program.startDate}</span></div>
              <div className="flex justify-between gap-3"><span>End</span><span>{program.endDate}</span></div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Complete</span>
                <span>{program.percentComplete}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${program.percentComplete}%` }} />
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 pt-6">
              <Link to={`/programs/${program.id}`} className="flex-1">
                <Button className="w-full">View Details</Button>
              </Link>
              <Button variant="ghost" className="px-3" onClick={() => openEdit(program)}><Edit3 size={17} /></Button>
              <Button variant="ghost" className="px-3 text-rose-300" onClick={() => setDeleteTarget(program)}><Trash2 size={17} /></Button>
            </div>
          </Card>
        ))}
      </div>

      {modalMode && (
        <ProgramModal
          title={modalMode === 'new' ? 'New Program' : 'Edit Program'}
          form={form}
          setForm={setForm}
          onClose={() => setModalMode(null)}
          onSave={saveProgram}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          program={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteProgram(deleteTarget.id).then(() => {
              setItems((current) => current.filter((program) => program.id !== deleteTarget.id))
              setDeleteTarget(null)
            }).catch((err) => setError(err.message))
          }}
        />
      )}
    </section>
  )
}
