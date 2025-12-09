'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import QRCode from 'react-qr-code'

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [url, setUrl] = useState('')
  const [qrValue, setQrValue] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert(error.message)
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) alert(error.message)
      else alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setQrValue('')
    setUrl('')
  }

  const generateQR = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setQrValue(url)
  }

  if (!session) {
    return (
      <main className="container">
        <div className="card">
          <h1>QR Master</h1>
          <p className="subtitle">Sign in to generate unlimited QR codes</p>
          <form onSubmit={handleAuth} className="input-group">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="card">
        <h1>QR Generator</h1>
        <p className="subtitle">Enter a URL to generate your QR code</p>
        <form onSubmit={generateQR} className="input-group">
          <div className="input-group">
            <label>Target URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit">Generate QR Code</button>
        </form>

        {qrValue && (
          <div className="qr-container">
            <QRCode value={qrValue} size={256} />
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    </main>
  )
}
