import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { SiteConfig } from '../types/site'
import { Admin } from '../admin/Admin'
import { adminEmails, isAllowedAdminEmail, supabase, supabaseConfigured } from '../lib/supabase'

export function AdminLogin({
  config,
  onChange,
  onPublic,
}: {
  config: SiteConfig
  onChange: (config: SiteConfig) => void
  onPublic: () => void
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!supabaseConfigured || !supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the deployment environment.')
      return
    }

    if (adminEmails.length === 0) {
      setError('No admin email is configured. Add the authorized address to VITE_ADMIN_EMAILS before enabling login.')
      return
    }

    setBusy(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (!isAllowedAdminEmail(data.user?.email)) {
      await supabase.auth.signOut()
      setError('This account is authenticated, but it is not authorized as a Shelvion administrator.')
      return
    }

    setPassword('')
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
  }

  if (!config.admin.enabled) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h1>Admin access disabled</h1>
          <p>The site administrator has disabled the Admin interface.</p>
          <button className="primary" onClick={onPublic}>Back to site</button>
        </div>
      </div>
    )
  }

  if (!config.admin.requireLogin) {
    return <Admin config={config} onChange={onChange} onPublic={onPublic} />
  }

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <p>Checking administrator session…</p>
        </div>
      </div>
    )
  }

  if (session?.user && isAllowedAdminEmail(session.user.email)) {
    return (
      <Admin
        config={config}
        onChange={onChange}
        onPublic={onPublic}
        adminUserEmail={session.user.email || ''}
        onAdminSignOut={signOut}
      />
    )
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={signIn}>
        <div className="admin-login-brand">{config.brand.name}</div>
        <h1>Administrator login</h1>
        <p>Sign in with the authorized Shelvion administrator account.</p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <div className="admin-login-error">{error}</div>}

        <div className="admin-login-actions">
          <button type="button" onClick={onPublic}>Back to site</button>
          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
