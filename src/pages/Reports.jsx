import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { FileDown, Plus } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { getBudgetRecords } from '../services/budgetService.js'
import { getMilestones } from '../services/milestonesService.js'
import { getPrograms } from '../services/programsService.js'
import { getRisks } from '../services/risksService.js'
import { getStakeholders } from '../services/stakeholdersService.js'

const reportHistorySeed = []
const actionsLogSeed = []

const sections = [
  'Executive Summary',
  'Portfolio RAG Dashboard',
  'Budget Summary',
  'Top Risks',
  'Milestone Health',
  'Stakeholder Summary',
  'Actions & Decisions Log',
]

function todayText() {
  return new Date('2026-05-10').toISOString().slice(0, 10)
}

function money(value) {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value)
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('proportal.reportHistory')) ?? reportHistorySeed
  } catch {
    return reportHistorySeed
  }
}

function saveHistory(history) {
  localStorage.setItem('proportal.reportHistory', JSON.stringify(history))
}

function Checkbox({ label, checked, onChange }) {
  return <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>
}

function ReportPreview({ config, actions }) {
  return (
    <Card className="h-full">
      <h2 className="text-lg font-semibold text-white">Live Preview</h2>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-wider text-violet-300">ProPortal Executive Report</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{config.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{config.startDate} to {config.endDate} | Prepared by {config.preparedBy}</p>
        <div className="mt-5 space-y-4">
          {config.sections.map((section) => <div key={section} className="rounded-xl border border-white/10 bg-slate-950/30 p-4"><h4 className="font-semibold text-white">{section}</h4><p className="mt-2 text-sm text-slate-300">{section === 'Actions & Decisions Log' ? `${actions.filter((item) => item.status !== 'Closed').length} open actions carried forward.` : `Preview content for ${section.toLowerCase()} across ${config.programs.length || 'all'} selected programs.`}</p></div>)}
        </div>
      </div>
    </Card>
  )
}

function buildPdf(config, actions, appendHistory, data) {
  const doc = new jsPDF()
  const footer = () => {
    const page = doc.getNumberOfPages()
    doc.setFontSize(8)
    doc.text(`Page ${page} | Confidential - ProPortal`, 14, 286)
  }
  doc.setFillColor(99, 102, 241)
  doc.roundedRect(14, 18, 18, 18, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.text('P', 21, 30)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(22)
  doc.text(config.title, 14, 54)
  doc.setFontSize(12)
  doc.text(`Reporting Period: ${config.startDate} to ${config.endDate}`, 14, 66)
  doc.text(`Prepared By: ${config.preparedBy}`, 14, 74)
  doc.text(`Date: ${todayText()}`, 14, 82)
  footer()
  config.sections.forEach((section) => {
    doc.addPage()
    doc.setFontSize(16)
    doc.text(section, 14, 20)
    doc.setFontSize(10)
    if (section === 'Portfolio RAG Dashboard') {
      data.programs.forEach((program, index) => {
        const y = 36 + index * 12
        const color = program.rag === 'Green' ? [34, 197, 94] : program.rag === 'Amber' ? [245, 158, 11] : [244, 63, 94]
        doc.text(program.name, 14, y)
        doc.setFillColor(...color)
        doc.rect(72, y - 5, 18, 7, 'F')
        doc.text(program.rag, 94, y)
      })
    } else if (section === 'Budget Summary') {
      data.budget.forEach((record, index) => doc.text(`${record.program}: planned ${money(record.planned)} | actual ${money(record.actual)}`, 14, 36 + index * 8))
    } else if (section === 'Top Risks') {
      data.risks.slice(0, 5).forEach((risk, index) => doc.text(`${risk.id} ${risk.title} | Score ${risk.score} | ${risk.owner}`, 14, 36 + index * 8))
    } else if (section === 'Milestone Health') {
      data.milestones.slice(0, 6).forEach((item, index) => doc.text(`${item.id} ${item.name} | ${item.status} | ${item.percentComplete}%`, 14, 36 + index * 8))
    } else if (section === 'Stakeholder Summary') {
      data.stakeholders.forEach((item, index) => doc.text(`${item.name} | ${item.attitude} | ${item.influence}/${item.interest}`, 14, 36 + index * 8))
    } else if (section === 'Actions & Decisions Log') {
      actions.forEach((item, index) => doc.text(`${item.action} | ${item.owner} | ${item.dueDate} | ${item.status}`, 14, 36 + index * 8))
    } else {
      doc.text('Overall delivery remains focused on budget discipline, milestone recovery, and active risk burn-down.', 14, 36)
    }
    footer()
  })
  doc.save(`${config.title.replaceAll(' ', '-').toLowerCase()}.pdf`)
  appendHistory('PDF')
}

function buildExcel(config, actions, appendHistory, data) {
  const workbook = XLSX.utils.book_new()
  if (config.sections.includes('Portfolio RAG Dashboard')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.programs.map(({ name, sponsor, rag, priority }) => ({ name, sponsor, rag, priority }))), 'Portfolio RAG')
  if (config.sections.includes('Budget Summary')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.budget), 'Budget Summary')
  if (config.sections.includes('Top Risks')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.risks), 'Top Risks')
  if (config.sections.includes('Milestone Health')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.milestones), 'Milestones')
  if (config.sections.includes('Stakeholder Summary')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.stakeholders), 'Stakeholders')
  if (config.sections.includes('Actions & Decisions Log')) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(actions), 'Actions')
  if (!workbook.SheetNames.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ note: 'No sections selected' }]), 'Report')
  XLSX.writeFile(workbook, `${config.title.replaceAll(' ', '-').toLowerCase()}.xlsx`)
  appendHistory('Excel')
}

export default function Reports() {
  const [history, setHistory] = useState(loadHistory)
  const [data, setData] = useState({ programs: [], budget: [], risks: [], milestones: [], stakeholders: [] })
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actions, setActions] = useState(actionsLogSeed)
  const [openOnly, setOpenOnly] = useState(false)
  const [actionForm, setActionForm] = useState({ action: '', owner: '', dueDate: '2026-05-31', status: 'Open', program: '', raisedIn: 'Executive Report' })
  const [config, setConfig] = useState({
    title: 'May Executive Portfolio Report',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    programs: [],
    sections,
    preparedBy: 'PMO',
  })
  useEffect(() => saveHistory(history), [history])
  useEffect(() => {
    Promise.all([getPrograms(), getBudgetRecords(), getRisks(), getMilestones(), getStakeholders()])
      .then(([programs, budget, risks, milestones, stakeholders]) => {
        setData({ programs, budget, risks, milestones, stakeholders })
        setConfig((current) => ({ ...current, programs: programs.map((program) => program.name) }))
        setActionForm((current) => ({ ...current, program: programs[0]?.name ?? '' }))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleActions = useMemo(() => actions.filter((item) => !openOnly || item.status !== 'Closed'), [actions, openOnly])
  const appendHistory = (type) => {
    setHistory((current) => [{ id: `REP-${Date.now()}`, title: config.title, date: todayText(), preparedBy: config.preparedBy, sections: config.sections, type }, ...current])
  }

  function toggleSection(section, checked) {
    setConfig((current) => ({ ...current, sections: checked ? [...current.sections, section] : current.sections.filter((item) => item !== section) }))
  }

  function toggleProgram(program, checked) {
    setConfig((current) => ({ ...current, programs: checked ? [...current.programs, program] : current.programs.filter((item) => item !== program) }))
  }

  function addAction() {
    if (!actionForm.action) return
    setActions((current) => [{ id: `ACT-${String(current.length + 1).padStart(3, '0')}`, ...actionForm }, ...current])
    setActionForm({ action: '', owner: '', dueDate: '2026-05-31', status: 'Open', program: data.programs[0]?.name ?? '', raisedIn: 'Executive Report' })
  }

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      {error && <Card className="text-rose-200">{error}</Card>}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Executive Packs</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Executive Reports</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">Report Generator</h2>
          <div className="mt-4 space-y-4">
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={config.title} onChange={(event) => setConfig({ ...config, title: event.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2"><input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={config.startDate} onChange={(event) => setConfig({ ...config, startDate: event.target.value })} /><input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={config.endDate} onChange={(event) => setConfig({ ...config, endDate: event.target.value })} /></div>
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Prepared By" value={config.preparedBy} onChange={(event) => setConfig({ ...config, preparedBy: event.target.value })} />
            <div><p className="mb-2 text-sm font-semibold text-white">Programs to include</p><div className="grid gap-2 sm:grid-cols-2">{data.programs.map((program) => <Checkbox key={program.id} label={program.name} checked={config.programs.includes(program.name)} onChange={(checked) => toggleProgram(program.name, checked)} />)}</div></div>
            <div><p className="mb-2 text-sm font-semibold text-white">Sections to include</p><div className="grid gap-2">{sections.map((section) => <Checkbox key={section} label={section} checked={config.sections.includes(section)} onChange={(checked) => toggleSection(section, checked)} />)}</div></div>
            <div className="flex gap-2"><Button onClick={() => buildPdf(config, actions, appendHistory, data)}><FileDown size={17} />Generate PDF</Button><Button variant="ghost" onClick={() => buildExcel(config, actions, appendHistory, data)}><FileDown size={17} />Generate Excel</Button></div>
          </div>
        </Card>
        <ReportPreview config={config} actions={actions} />
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Report History</h2>
        <div className="overflow-auto rounded-xl border border-white/10"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-3">Title</th><th className="p-3">Date</th><th className="p-3">Prepared By</th><th className="p-3">Sections</th><th className="p-3">Download PDF</th><th className="p-3">Download Excel</th></tr></thead><tbody className="divide-y divide-white/10 text-slate-200">{history.map((item) => <tr key={item.id}><td className="p-3 font-semibold text-white">{item.title}</td><td className="p-3">{item.date}</td><td className="p-3">{item.preparedBy}</td><td className="p-3">{item.sections.join(', ')}</td><td className="p-3"><Button variant="ghost" className="h-8 px-3" onClick={() => buildPdf({ ...config, title: item.title, sections: item.sections, preparedBy: item.preparedBy }, actions, appendHistory, data)}>PDF</Button></td><td className="p-3"><Button variant="ghost" className="h-8 px-3" onClick={() => buildExcel({ ...config, title: item.title, sections: item.sections }, actions, appendHistory, data)}>Excel</Button></td></tr>)}</tbody></table></div>
      </Card>
      <Card>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h2 className="text-lg font-semibold text-white">Actions & Decisions Log</h2><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={openOnly} onChange={(event) => setOpenOnly(event.target.checked)} />Open only</label></div>
        <div className="mb-4 grid gap-3 lg:grid-cols-6"><input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Action" value={actionForm.action} onChange={(event) => setActionForm({ ...actionForm, action: event.target.value })} /><input className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Owner" value={actionForm.owner} onChange={(event) => setActionForm({ ...actionForm, owner: event.target.value })} /><input type="date" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={actionForm.dueDate} onChange={(event) => setActionForm({ ...actionForm, dueDate: event.target.value })} /><select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={actionForm.status} onChange={(event) => setActionForm({ ...actionForm, status: event.target.value })}><option>Open</option><option>In Progress</option><option>Closed</option></select><select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" value={actionForm.program} onChange={(event) => setActionForm({ ...actionForm, program: event.target.value })}>{data.programs.map((program) => <option key={program.id}>{program.name}</option>)}</select><Button onClick={addAction}><Plus size={17} />Add Action</Button></div>
        <div className="overflow-auto rounded-xl border border-white/10"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400"><tr>{['Action', 'Owner', 'Due Date', 'Status', 'Program', 'Raised In'].map((column) => <th key={column} className="p-3">{column}</th>)}</tr></thead><tbody className="divide-y divide-white/10 text-slate-200">{visibleActions.map((item) => <tr key={item.id}><td className="p-3 font-semibold text-white">{item.action}</td><td className="p-3">{item.owner}</td><td className="p-3">{item.dueDate}</td><td className="p-3">{item.status}</td><td className="p-3">{item.program}</td><td className="p-3">{item.raisedIn}</td></tr>)}</tbody></table></div>
      </Card>
    </section>
  )
}
