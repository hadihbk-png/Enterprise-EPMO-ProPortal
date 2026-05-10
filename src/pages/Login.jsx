import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/dashboard" replace />

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4 text-white">
      <div className="gradient-mesh" aria-hidden="true" />
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Sign in to ProPortal</h1>
        {location.state?.message && <p className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{location.state.message}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button className="w-full">Sign In</Button>
        </form>
        <p className="mt-4 text-sm text-slate-300">No account? <Link className="text-indigo-300" to="/register">Register</Link></p>
      </Card>
    </div>
  )
}
