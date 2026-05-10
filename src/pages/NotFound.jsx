import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center">
      <Card className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">The module route you requested does not exist in ProPortal.</p>
        <Link to="/dashboard" className="mt-6 inline-flex">
          <Button>Return to dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}
