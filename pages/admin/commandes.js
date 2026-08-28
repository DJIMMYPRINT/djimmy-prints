import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAdminRequest } from '../../lib/adminAuth'
import { getSupabaseAdmin } from '../../lib/supabaseAdmin'

export async function getServerSideProps({ req }) {
  if (!isAdminRequest(req)) {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }

  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  return { props: { orders: error ? [] : data, loadError: !!error } }
}

export default function AdminCommandes({ orders, loadError }) {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <>
      <Head><title>Commandes — Back-office Djimmy Prints</title></Head>
      <div style={{padding:'9rem 4vw 5rem',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',marginBottom:'2rem'}}>
          <div>
            <p className="s-lbl">Back-office</p>
            <h1 className="s-ttl" style={{fontSize:'clamp(1.6rem,3.5vw,2.4rem)'}}>Commandes reçues</h1>
          </div>
          <button onClick={logout} className="btn-outline">Déconnexion</button>
        </div>

        {loadError && (
          <p style={{color:'#B3261E',marginBottom:'1.5rem'}}>Erreur de chargement des commandes. Vérifiez la configuration Supabase.</p>
        )}

        {orders.length === 0 && !loadError && (
          <p style={{color:'var(--muted)'}}>Aucune commande enregistrée pour le moment.</p>
        )}

        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {orders.map(o => (
            <div key={o.id} style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'8px',padding:'1.3rem 1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'.5rem',marginBottom:'.8rem'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:'.95rem'}}>{o.nom}{o.entreprise ? ` — ${o.entreprise}` : ''}</div>
                  <div style={{fontSize:'.8rem',color:'var(--muted)'}}>{o.tel}{o.email ? ` · ${o.email}` : ''}</div>
                  <div style={{fontSize:'.8rem',color:'var(--muted)'}}>{o.wilaya}{o.adresse ? ` — ${o.adresse}` : ''}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'Anton',fontSize:'1.2rem',color:'var(--green)'}}>{o.total ? o.total.toLocaleString('fr-DZ') : '—'} DA</div>
                  <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{new Date(o.created_at).toLocaleString('fr-DZ')}</div>
                </div>
              </div>

              <div style={{fontSize:'.82rem',color:'var(--black)',marginBottom:'.5rem'}}>
                {(o.produits || []).map((p, i) => (
                  <div key={i}>{p.emoji} {p.name} · {p.color} · {p.qty} pcs</div>
                ))}
              </div>

              <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',fontSize:'.72rem',color:'var(--muted)'}}>
                {o.technique && <span style={{background:'var(--green-pale)',color:'var(--green)',padding:'.2rem .6rem',borderRadius:'100px',fontWeight:600}}>{o.technique}</span>}
                {o.paiement && <span style={{background:'var(--cream)',padding:'.2rem .6rem',borderRadius:'100px',fontWeight:600}}>{o.paiement}</span>}
                {o.logo_name && <span style={{background:'var(--cream)',padding:'.2rem .6rem',borderRadius:'100px',fontWeight:600}}>📎 {o.logo_name}</span>}
              </div>

              {o.notes && <div style={{marginTop:'.6rem',fontSize:'.8rem',color:'var(--muted)',fontStyle:'italic'}}>{o.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
