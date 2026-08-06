import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabaseBrowser } from '../../lib/supabase/browserClient'

const inputStyle = {
  width: '100%', padding: '.75rem 1rem', border: '1.5px solid var(--cream-border)',
  borderRadius: '4px', fontSize: '.9rem', fontFamily: 'Inter',
  background: 'var(--white)', color: 'var(--black)', outline: 'none',
}
const labelStyle = { display: 'block', fontSize: '.75rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Email ou mot de passe incorrect.'); return }
    router.push('/admin')
  }

  return (
    <>
      <Head><title>Connexion admin — Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380, background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px', padding: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Anton', fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '1.8rem', textAlign: 'center' }}>
            Djimmy <span style={{ color: 'var(--green)' }}>Admin</span>
          </h1>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" required style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Mot de passe</label>
            <input type="password" required style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {error && <p style={{ color: '#B23A3A', fontSize: '.82rem', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-g" style={{ width: '100%', justifyContent: 'center', opacity: loading ? .7 : 1 }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </>
  )
}
