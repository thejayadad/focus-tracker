'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function onSignup() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
	  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },

    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/habits')
    router.refresh()
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Login</h1>
      <p style={{ opacity: 0.8 }}>Sign in to your habit tracker.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <label>
          <div>Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ width: '100%', padding: 10 }}
          />
        </label>

        <label>
          <div>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ width: '100%', padding: 10 }}
          />
        </label>

        {error ? (
          <div style={{ color: 'crimson' }}>{error}</div>
        ) : null}

        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? 'Working…' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={onSignup}
          disabled={loading}
          style={{ padding: 10 }}
        >
          {loading ? 'Working…' : 'Create account'}
        </button>
      </form>
    </main>
  )
}

