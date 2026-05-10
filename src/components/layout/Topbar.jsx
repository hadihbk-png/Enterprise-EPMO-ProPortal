import { Bell, Moon, Search, Sun } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/useAuth.js'
import { useAppContext } from '../../context/useAppContext.js'

export default function Topbar() {
  const { theme, toggleTheme } = useAppContext()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex min-w-fit items-center gap-3 md:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-300/30">
            <span className="text-sm font-bold">P</span>
          </div>
          <span className="text-sm font-semibold text-white">ProPortal</span>
        </div>

        <div className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300 sm:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search programs, risks, milestones..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <span className="hidden max-w-48 truncate text-sm text-slate-300 lg:inline">{user?.email}</span>
          <Button variant="ghost" className="hidden h-10 px-3 sm:inline-flex" onClick={signOut}>Sign Out</Button>
          <div className="h-10 w-10 rounded-full border border-white/15 bg-gradient-to-br from-cyan-300 via-indigo-400 to-rose-400" />
        </div>
      </div>
    </header>
  )
}
