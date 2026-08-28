import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '../lib/supabaseBrowser'
import { WA } from '../lib/constants'

const inputStyle = {
  width:'100%', padding:'.75rem 1rem', border:'1.5px solid var(--cream-border)',
  borderRadius:'4px', fontSize:'.9rem', fontFamily:'Inter',
  background:'var(--white)', color:'var(--black)', outline:'none', marginBottom:'1rem',
}
const labelStyle = { display:'block', fontSize:'.75rem', fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'.4rem' }

export default function Compte() {
  const [configError, setConfigError] = useState(false)
  const [session, setSession] = useState(undefined) // undefined = loading, null = logged out
  const [tab, setTab] = useState('connexion')
  const [form, setForm] = useState({ entreprise:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState(false)

  useEffect(() => {
    let sb
    try { sb = getSupabaseBrowser() } catch { setConfigError(true); return }

    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    setOrdersError(false)
    fetch('/api/account/orders', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then(r => r.json())
      .then(d => { if (d.orders) setOrders(d.orders); else setOrdersError(true) })
      .catch(() => setOrdersError(true))
  }, [session])

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo(''); setLoading(true)
    const sb = getSupabaseBrowser()
    if (tab === 'connexion') {
      const { error: err } = await sb.auth.signInWithPassword({ email: form.email, password: form.password })
      if (err) setError('Email ou mot de passe incorrect.')
    } else {
      const { data, error: err } = await sb.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { entreprise: form.entreprise } },
      })
      if (err) setError(err.message)
      else if (!data.session) setInfo('Compte créé — vérifiez votre email pour confirmer avant de vous connecter.')
    }
    setLoading(false)
  }

  const logout = async () => { await getSupabaseBrowser().auth.signOut(); setOrders([]) }

  const reorderMsg = (o) => encodeURIComponent(
    `Bonjour Djimmy Prints, je souhaite repasser une commande similaire à celle du ${new Date(o.created_at).toLocaleDateString('fr-DZ')} :\n` +
    (o.produits || []).map(p => `- ${p.name} (${p.color}) × ${p.qty}`).join('\n')
  )

  if (configError) {
    return (
      <div style={{padding:'9rem 4vw 5rem',position:'relative',zIndex:1,maxWidth:520}}>
        <p className="s-lbl">Espace entreprise</p>
        <h1 className="s-ttl" style={{fontSize:'clamp(1.6rem,3.5vw,2.2rem)'}}>Bientôt disponible</h1>
        <p className="s-desc">L'espace compte entreprise n'est pas encore configuré côté serveur.</p>
      </div>
    )
  }

  if (session === undefined) {
    return <div style={{padding:'9rem 4vw 5rem',position:'relative',zIndex:1}} />
  }

  if (!session) {
    return (
      <>
        <Head><title>Mon compte — Djimmy Prints</title></Head>
        <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'9rem 4vw 5rem',position:'relative',zIndex:1}}>
          <div style={{width:'100%',maxWidth:400}}>
            <div style={{display:'flex',gap:0,marginBottom:'1.5rem',borderBottom:'1.5px solid var(--cream-border)'}}>
              {[['connexion','Connexion'],['inscription','Créer un compte']].map(([k,label]) => (
                <button key={k} onClick={()=>{setTab(k);setError('');setInfo('')}} style={{
                  flex:1,padding:'.8rem',border:'none',background:'none',cursor:'pointer',fontFamily:'Inter',fontWeight:600,fontSize:'.85rem',
                  color: tab===k ? 'var(--green)' : 'var(--muted)',
                  borderBottom: tab===k ? '2px solid var(--green)' : '2px solid transparent',
                  marginBottom:'-1.5px',
                }}>{label}</button>
              ))}
            </div>

            <form onSubmit={submit} style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'10px',padding:'1.8rem'}}>
              {tab === 'inscription' && (
                <>
                  <label style={labelStyle}>Entreprise</label>
                  <input style={inputStyle} value={form.entreprise} onChange={e=>setForm(f=>({...f,entreprise:e.target.value}))} placeholder="Nom de votre entreprise" />
                </>
              )}
              <label style={labelStyle}>Email</label>
              <input type="email" required style={inputStyle} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" required minLength={6} style={inputStyle} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />

              {error && <p style={{color:'#B3261E',fontSize:'.8rem',marginBottom:'1rem'}}>{error}</p>}
              {info && <p style={{color:'var(--green)',fontSize:'.8rem',marginBottom:'1rem'}}>{info}</p>}

              <button type="submit" disabled={loading} className="btn-g" style={{width:'100%',justifyContent:'center',opacity:loading?.6:1}}>
                {loading ? 'Patientez...' : tab === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Mon compte — Djimmy Prints</title></Head>
      <div style={{padding:'9rem 4vw 5rem',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',marginBottom:'2rem'}}>
          <div>
            <p className="s-lbl">Espace entreprise</p>
            <h1 className="s-ttl" style={{fontSize:'clamp(1.6rem,3.5vw,2.2rem)'}}>
              {session.user.user_metadata?.entreprise || session.user.email}
            </h1>
          </div>
          <button onClick={logout} className="btn-outline">Déconnexion</button>
        </div>

        <h2 style={{fontFamily:'Anton',fontSize:'1.1rem',textTransform:'uppercase',marginBottom:'1.2rem'}}>Historique des commandes</h2>

        {ordersError && <p style={{color:'#B3261E'}}>Erreur de chargement de vos commandes.</p>}
        {!ordersError && orders.length === 0 && (
          <p style={{color:'var(--muted)'}}>Aucune commande liée à ce compte pour le moment. Vos futures commandes passées en étant connecté apparaîtront ici.</p>
        )}

        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {orders.map(o => (
            <div key={o.id} style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'8px',padding:'1.3rem 1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'.5rem',marginBottom:'.6rem'}}>
                <div style={{fontSize:'.78rem',color:'var(--muted)'}}>{new Date(o.created_at).toLocaleDateString('fr-DZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
                <div style={{fontFamily:'Anton',fontSize:'1.1rem',color:'var(--green)'}}>{o.total ? o.total.toLocaleString('fr-DZ') : '—'} DA</div>
              </div>
              <div style={{fontSize:'.85rem',marginBottom:'.8rem'}}>
                {(o.produits || []).map((p,i) => <div key={i}>{p.emoji} {p.name} · {p.color} · {p.qty} pcs</div>)}
              </div>
              <a href={`https://wa.me/${WA}?text=${reorderMsg(o)}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{fontSize:'.75rem',padding:'.6rem 1.2rem'}}>
                💬 Recommander via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
