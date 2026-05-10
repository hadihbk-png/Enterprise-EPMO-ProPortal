import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Register() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    try {
      await signUp(email, password)
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
    } catch (err) {
      setError(err.message)
    }
  }

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="grid min-h-screen place-items-center p-4 text-white">
      <div className="gradient-mesh" aria-hidden="true" />
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Create your ProPortal account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input type="password" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" placeholder="Confirm Password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button className="w-full">Register / Sign Up</Button>
        </form>
        <p className="mt-4 text-sm text-slate-300">Already have an account? <Link className="text-indigo-300" to="/login">Sign In</Link></p>
      </Card>
    </div>
  )
}
