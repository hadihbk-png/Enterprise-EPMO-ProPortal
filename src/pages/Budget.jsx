import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { FileDown, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { createBudgetRecord, getBudgetRecords } from '../services/budgetService.js'
import { getPrograms } from '../services/programsService.js'

const rates = { USD: 1, AED: 3.6725, SGD: 1.35, GBP: 0.79 }
const symbols = { USD: 'USD', AED: 'AED', SGD: 'SGD', GBP: 'GBP' }

function convert(value, currency) {
  return value * rates[currency]
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    notation: Math.abs(value) >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(convert(value, currency))
}

function fullMoney(value, currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(convert(value, currency))
}

function burnColor(percent) {
  if (percent <= 70) return '#22c55e'
  if (percent <= 90) return '#f59e0b'
  return '#ef4444'
}

function varianceColor(value) {
  return value >= 0 ? '#22c55e' : '#ef4444'
}

function cumulativeRows(monthly) {
  let planned = 0
  let actual = 0
  return monthly.map((row) => {
    planned += row.planned
    actual += row.actual
    return { ...row, variance: row.planned - row.actual, cumulativePlanned: planned, cumulativeActual: actual }
  })
}

function totalsFor(record) {
  const actual = record.monthly.reduce((sum, row) => sum + row.actual, 0)
  const planned = record.monthly.reduce((sum, row) => sum + row.planned, 0)
  return {
    actual,
    planned,
    remaining: record.allocated - actual,
    variance: record.allocated - actual,
    burn: Math.round((actual / record.allocated) * 100),
  }
}

function Drawer({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950/95 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-white">Close</button>
        </div>
        {children}
      </motion.aside>
    </div>
  )
}

function BudgetEntryDrawer({ form, setForm, records, onSave, onClose }) {
  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none'
  return (
    <Drawer title="Budget Entry" onClose={onClose}>
      <div className="space-y-4">
        <select className={inputClass} value={form.program} onChange={(event) => setForm({ ...form, program: event.target.value })}>
          {records.map((record) => <option key={record.program}>{record.program}</option>)}
        </select>
        <input className={inputClass} placeholder="Month" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} />
        <input type="number" className={inputClass} placeholder="Planned Amount" value={form.planned} onChange={(event) => setForm({ ...form, planned: event.target.value })} />
        <input type="number" className={inputClass} placeholder="Actual Amount" value={form.actual} onChange={(event) => setForm({ ...form, actual: event.target.value })} />
        <textarea className={`${inputClass} min-h-24`} placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <Button className="w-full" onClick={onSave}>Save Budget Record</Button>
      </div>
    </Drawer>
  )
}

function SummaryTiles({ summary, currency }) {
  const tiles = [
    ['Total Portfolio Budget', summary.allocated, '#06b6d4'],
    ['Total Committed', summary.committed, '#6366f1'],
    ['Total Actual Spent', summary.actual, '#8b5cf6'],
    ['Overall Variance', summary.variance, varianceColor(summary.variance)],
    ['Forecast at Completion', summary.fac, '#ec4899'],
  ]

  return (
    <Card>
      <div className="grid gap-4 md:grid-cols-5">
        {tiles.map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white" style={{ color }}>{formatMoney(value, currency)}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>Budget Utilisation</span>
          <span>{summary.utilisation}% spent of allocated</span>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-cyan-400" style={{ width: `${Math.min(summary.utilisation, 100)}%` }} />
        </div>
      </div>
    </Card>
  )
}

function ProgramBudgetTable({ records, setRecords, currency, expanded, setExpanded }) {
  const [sortKey, setSortKey] = useState('program')

  const rows = useMemo(
    () => [...records].sort((a, b) => String(sortKey === 'actual' ? totalsFor(a).actual : a[sortKey]).localeCompare(String(sortKey === 'actual' ? totalsFor(b).actual : b[sortKey]))),
    [records, sortKey],
  )

  function updateForecast(program, key, value) {
    setRecords((current) => current.map((record) => record.program === program ? { ...record, [key]: Number(value) } : record))
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-white">Program Budget Table</h2>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>{['program', 'allocated', 'committed', 'actual', 'remaining', 'burn', 'ftc', 'eac', 'variance', 'status'].map((column) => <th key={column} className="p-3"><button type="button" onClick={() => setSortKey(column)}>{column}</button></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {rows.map((record) => {
              const totals = totalsFor(record)
              const color = burnColor(totals.burn)
              return (
                <tr key={record.program} onClick={() => setExpanded(expanded === record.program ? null : record.program)} className="cursor-pointer hover:bg-white/[0.04]">
                  <td className="p-3 font-semibold text-white">{record.program}</td>
                  <td className="p-3">{formatMoney(record.allocated, currency)}</td>
                  <td className="p-3">{formatMoney(record.committed, currency)}</td>
                  <td className="p-3">{formatMoney(totals.actual, currency)}</td>
                  <td className="p-3">{formatMoney(totals.remaining, currency)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-white/10"><div className="h-2 rounded-full" style={{ width: `${Math.min(totals.burn, 100)}%`, backgroundColor: color }} /></div>
                      <span style={{ color }}>{totals.burn}%</span>
                    </div>
                  </td>
                  <td className="p-3"><input type="number" className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white" value={record.ftc} onClick={(event) => event.stopPropagation()} onChange={(event) => updateForecast(record.program, 'ftc', event.target.value)} /></td>
                  <td className="p-3"><input type="number" className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white" value={record.eac} onClick={(event) => event.stopPropagation()} onChange={(event) => updateForecast(record.program, 'eac', event.target.value)} /></td>
                  <td className="p-3" style={{ color: varianceColor(totals.variance) }}>{formatMoney(totals.variance, currency)}</td>
                  <td className="p-3"><span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}20` }}>{totals.burn > 100 ? 'Over' : totals.burn > 90 ? 'Watch' : 'Healthy'}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function MonthlyBurnTable({ record, currency }) {
  if (!record) return null
  const rows = cumulativeRows(record.monthly)
  const footer = rows.reduce((sum, row) => ({ planned: sum.planned + row.planned, actual: sum.actual + row.actual }), { planned: 0, actual: 0 })

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-white">Monthly Burn Rate - {record.program}</h2>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['Month', 'Planned', 'Actual', 'Variance', 'Cumulative Planned', 'Cumulative Actual'].map((column) => <th key={column} className="p-3">{column}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/10 text-slate-200">{rows.map((row) => <tr key={row.month}><td className="p-3">{row.month}</td><td className="p-3">{formatMoney(row.planned, currency)}</td><td className="p-3">{formatMoney(row.actual, currency)}</td><td className="p-3" style={{ color: varianceColor(row.variance) }}>{formatMoney(row.variance, currency)}</td><td className="p-3">{formatMoney(row.cumulativePlanned, currency)}</td><td className="p-3">{formatMoney(row.cumulativeActual, currency)}</td></tr>)}</tbody>
          <tfoot className="bg-white/[0.04] font-semibold text-white"><tr><td className="p-3">YTD Total</td><td className="p-3">{formatMoney(footer.planned, currency)}</td><td className="p-3">{formatMoney(footer.actual, currency)}</td><td className="p-3" style={{ color: varianceColor(footer.planned - footer.actual) }}>{formatMoney(footer.planned - footer.actual, currency)}</td><td className="p-3" /><td className="p-3" /></tr></tfoot>
        </table>
      </div>
    </Card>
  )
}

function CostTrendChart({ records, currency, budgetCap }) {
  const data = useMemo(() => {
    const months = records[0]?.monthly.map((row) => row.month) ?? []
    return months.map((month) => {
      const totals = records.reduce((sum, record) => {
        const row = record.monthly.find((item) => item.month === month)
        return {
          planned: sum.planned + (row?.planned ?? 0),
          actual: sum.actual + (row?.actual ?? 0),
          forecast: sum.forecast + (row?.forecast ?? 0),
        }
      }, { planned: 0, actual: 0, forecast: 0 })
      return { month, ...totals, varianceFill: totals.actual <= totals.planned ? '#22c55e22' : '#ef444422' }
    })
  }, [records])

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-white">Cost Trend</h2>
      <div id="cost-trend-chart" className="h-96">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 22, right: 24, left: 8, bottom: 6 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => formatMoney(value, currency)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(value) => fullMoney(value, currency)} />
            <Legend />
            <ReferenceLine y={budgetCap / 6} stroke="#ef4444" strokeDasharray="7 6" label={{ value: 'Budget cap pace', fill: '#fca5a5', position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="planned" name="Planned" stroke="#06b6d4" strokeWidth={2} strokeDasharray="7 6" dot={false} isAnimationActive />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} isAnimationActive />
            <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="2 6" dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-400">Variance shading is represented in the table and export; chart lines animate on mount.</p>
    </Card>
  )
}

export default function Budget() {
  const [records, setRecords] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [expanded, setExpanded] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [override, setOverride] = useState(null)
  const [form, setForm] = useState({ program: '', month: '2026-07-01', planned: '', actual: '', notes: '' })

  useEffect(() => {
    Promise.all([getPrograms(), getBudgetRecords()])
      .then(([programData, budgetData]) => {
        const grouped = programData.map((program) => ({
          program: program.name,
          programId: program.id,
          allocated: program.budgetAllocated,
          committed: 0,
          ftc: 0,
          eac: program.budgetAllocated,
          monthly: budgetData.filter((record) => record.programId === program.id).map((record) => ({ ...record, month: record.month?.slice(0, 7) ?? record.month })),
        }))
        setRecords(grouped)
        setExpanded(grouped[0]?.program ?? null)
        setForm((current) => ({ ...current, program: grouped[0]?.program ?? '' }))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const summary = useMemo(() => {
    const allocated = records.reduce((sum, record) => sum + record.allocated, 0)
    const committed = records.reduce((sum, record) => sum + record.committed, 0)
    const actual = records.reduce((sum, record) => sum + totalsFor(record).actual, 0)
    const fac = records.reduce((sum, record) => sum + record.eac, 0)
    return { allocated, committed, actual, variance: allocated - actual, fac, utilisation: Math.round((actual / allocated) * 100) }
  }, [records])

  const expandedRecord = records.find((record) => record.program === expanded)

  function saveBudgetEntry(force = false) {
    const target = records.find((record) => record.program === form.program)
    const currentActual = target.monthly.reduce((sum, row) => sum + row.actual, 0)
    const nextActual = currentActual + Number(form.actual || 0)
    if (!force && nextActual > target.allocated) {
      setOverride({ target, nextActual })
      return
    }
    createBudgetRecord({ programId: target.programId, month: form.month, planned: Number(form.planned || 0), actual: Number(form.actual || 0), notes: form.notes }).catch((err) => setError(err.message))
    setRecords((current) => current.map((record) => record.program === form.program ? {
      ...record,
      monthly: [...record.monthly, { month: form.month, planned: Number(form.planned || 0), actual: Number(form.actual || 0), forecast: Number(form.actual || 0), notes: form.notes }],
    } : record))
    setDrawerOpen(false)
    setOverride(null)
    setForm({ program: records[0]?.program ?? '', month: '2026-07-01', planned: '', actual: '', notes: '' })
  }

  function exportExcel() {
    const summaryRows = records.map((record) => {
      const totals = totalsFor(record)
      return { Program: record.program, Allocated: record.allocated, Committed: record.committed, Actual: totals.actual, Remaining: totals.remaining, BurnPercent: totals.burn, FTC: record.ftc, EAC: record.eac, Variance: totals.variance }
    })
    const monthlyRows = records.flatMap((record) => cumulativeRows(record.monthly).map((row) => ({ Program: record.program, ...row })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'Program Budget Summary')
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(monthlyRows), 'Monthly Burn Rate')
    XLSX.writeFile(workbook, 'proportal-budget.xlsx')
  }

  function exportPdf() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('ProPortal Budget & Financial Tracking', 14, 18)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26)
    doc.text(`Currency: ${currency}`, 14, 32)
    doc.text(`Total Budget: ${fullMoney(summary.allocated, currency)}`, 14, 44)
    doc.text(`Committed: ${fullMoney(summary.committed, currency)}`, 14, 51)
    doc.text(`Actual Spent: ${fullMoney(summary.actual, currency)}`, 14, 58)
    doc.text(`Variance: ${fullMoney(summary.variance, currency)}`, 14, 65)
    doc.text('Cost trend snapshot', 14, 80)
    doc.setDrawColor(6, 182, 212)
    doc.line(18, 118, 62, 104)
    doc.setDrawColor(99, 102, 241)
    doc.line(18, 122, 62, 108)
    doc.setDrawColor(139, 92, 246)
    doc.line(18, 126, 62, 110)
    records.forEach((record, index) => {
      const totals = totalsFor(record)
      doc.text(`${record.program}: actual ${fullMoney(totals.actual, currency)} | EAC ${fullMoney(record.eac, currency)}`, 14, 142 + index * 7)
    })
    doc.save('proportal-budget.pdf')
  }

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      {error && <Card className="text-rose-200">{error}</Card>}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Financial Control</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Budget & Financial Tracking</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {Object.keys(symbols).map((item) => <option key={item}>{item}</option>)}
          </select>
          <Button variant="ghost" onClick={exportExcel}><FileDown size={17} />Export Excel</Button>
          <Button variant="ghost" onClick={exportPdf}><FileDown size={17} />Export PDF</Button>
          <Button onClick={() => setDrawerOpen(true)}><Plus size={17} />Budget Entry</Button>
        </div>
      </div>
      <SummaryTiles summary={summary} currency={currency} />
      <ProgramBudgetTable records={records} setRecords={setRecords} currency={currency} expanded={expanded} setExpanded={setExpanded} />
      <MonthlyBurnTable record={expandedRecord} currency={currency} />
      <CostTrendChart records={records} currency={currency} budgetCap={summary.allocated} />
      {drawerOpen && <BudgetEntryDrawer form={form} setForm={setForm} records={records} onSave={() => saveBudgetEntry(false)} onClose={() => setDrawerOpen(false)} />}
      {override && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-white">Override Budget Cap?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">This entry would take {override.target.program} actual spend above allocated budget. Confirm override to save it anyway.</p>
            <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setOverride(null)}>Cancel</Button><Button className="bg-rose-500 hover:bg-rose-400" onClick={() => saveBudgetEntry(true)}>Confirm Override</Button></div>
          </Card>
        </div>
      )}
    </section>
  )
}
