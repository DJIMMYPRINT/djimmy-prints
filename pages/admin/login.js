import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Connexion impossible')
        setLoading(false)
        return
      }
      router.push('/admin/commandes')
    } catch {
      setError('Connexion impossible')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Back-office — Djimmy Prints</title></Head>
      <div style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'9rem 4vw 5rem',position:'relative',zIndex:1}}>
        <form onSubmit={submit} style={{width:'100%',maxWidth:360,background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'10px',padding:'2rem'}}>
          <h1 style={{fontFamily:'Anton',fontSize:'1.2rem',textTransform:'uppercase',marginBottom:'1.5rem'}}>Back-office</h1>
          <label style={{display:'block',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',color:'var(--muted)',marginBottom:'.4rem'}}>Mot de passe</label>
          <input
            type="password" value={password} onChange={e=>setPassword(e.target.value)} autoFocus
            style={{width:'100%',padding:'.75rem 1rem',border:'1.5px solid var(--cream-border)',borderRadius:'4px',fontSize:'.9rem',fontFamily:'Inter',marginBottom:'1rem'}}
          />
          {error && <p style={{color:'#B3261E',fontSize:'.8rem',marginBottom:'1rem'}}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-g" style={{width:'100%',justifyContent:'center',opacity:loading?.6:1}}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </>
  )
}
