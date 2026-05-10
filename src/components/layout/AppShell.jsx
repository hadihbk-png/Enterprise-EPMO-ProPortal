import { Outlet } from 'react-router-dom'
import ErrorBoundary from '../ui/ErrorBoundary.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppShell() {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="gradient-mesh" aria-hidden="true" />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-x-hidden px-4 pb-6 pt-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  )
}
