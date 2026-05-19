import { motion } from 'framer-motion'
import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CalendarCheck,
  ChevronLeft,
  Gauge,
  Landmark,
  PieChart,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext.js'

const items = [
  { label: 'Dashboard', path: '/dashboard', icon: Gauge, color: '#94a3b8' },
  { label: 'Programs', path: '/programs', icon: BriefcaseBusiness, color: 'var(--color-programs)' },
  { label: 'Portfolio', path: '/portfolio', icon: PieChart, color: 'var(--color-portfolio)' },
  { label: 'Risks & Issues', path: '/risks', icon: ShieldAlert, color: 'var(--color-risks)' },
  { label: 'Stakeholders', path: '/stakeholders', icon: Users, color: 'var(--color-stakeholders)' },
  { label: 'Budget', path: '/budget', icon: Landmark, color: 'var(--color-budget)' },
  { label: 'Milestones', path: '/milestones', icon: CalendarCheck, color: 'var(--color-milestones)' },
  { label: 'Reports', path: '/reports', icon: BarChart3, color: 'var(--color-reports)' },
  { label: 'Settings', path: '/settings', icon: Settings, color: '#a3a3a3' },
]

export default function Sidebar() {
  const { isSidebarCollapsed, setSidebarCollapsed } = useAppContext()

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-black/20 px-3 py-4 backdrop-blur-xl md:flex md:flex-col"
    >
      <div className="mb-5 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/30">
              <BellRing size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ProPortal</p>
              <p className="text-xs text-slate-400">PPM Suite</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ '--accent': item.color }}
              className={({ isActive }) =>
                [
                  'group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition',
                  'text-slate-300 hover:bg-white/[0.08] hover:text-white',
                  isActive ? 'bg-white/10 text-white shadow-[0_0_24px_rgba(255,255,255,0.08)]' : '',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-2 h-7 w-1 rounded-r-full transition ${
                      isActive ? 'opacity-100 shadow-[0_0_18px_var(--accent)]' : 'opacity-0'
                    }`}
                    style={{ background: 'var(--accent)' }}
                  />
                  <Icon size={19} style={{ color: item.color }} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </motion.aside>
  )
}
