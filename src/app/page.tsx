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

  const handleGitHubLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    })
    if (error) alert(error.message)
    setLoading(false)
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

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            onClick={handleGitHubLogin}
            className="github-btn"
            disabled={loading}
          >
            <svg
              height="20"
              viewBox="0 0 16 16"
              version="1.1"
              width="20"
              aria-hidden="true"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
            Sign in with GitHub
          </button>

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
