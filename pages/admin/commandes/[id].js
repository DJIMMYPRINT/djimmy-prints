import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { requireAdminSession } from '../../../lib/supabase/requireAdminSession'
import { supabaseBrowser } from '../../../lib/supabase/browserClient'

const STATUS_OPTIONS = ['nouvelle', 'confirmee', 'en_production', 'livree', 'annulee']
const STATUS_LABEL = {
  nouvelle: 'Nouvelle', confirmee: 'Confirmée', en_production: 'En production',
  livree: 'Livrée', annulee: 'Annulée',
}

export async function getServerSideProps(ctx) {
  const session = await requireAdminSession(ctx)
  if (session.redirect) return session
  const { data: order } = await session.supabase.from('orders').select('*').eq('id', ctx.params.id).single()
  if (!order) return { notFound: true }
  return { props: { order } }
}

const row = { display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '.6rem' }
const cardStyle = { background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.2rem' }

export default function AdminOrderDetail({ order }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)

  const updateStatus = async (e) => {
    const next = e.target.value
    setStatus(next)
    setSaving(true)
    const { error } = await supabaseBrowser().from('orders').update({ status: next }).eq('id', order.id)
    setSaving(false)
    if (error) alert('Erreur : ' + error.message)
    else router.replace(router.asPath)
  }

  return (
    <>
      <Head><title>Commande {order.nom} — Admin Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 4vw', borderBottom: '1px solid var(--cream-border)' }}>
          <Link href="/admin/commandes" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.85rem' }}>← Commandes</Link>
          <span style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase' }}>{order.nom}</span>
        </div>

        <div style={{ padding: '2rem 4vw', maxWidth: 640 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                {new Date(order.created_at).toLocaleString('fr-DZ')}
              </span>
              <select value={status} onChange={updateStatus} disabled={saving} style={{ padding: '.5rem .8rem', borderRadius: '4px', border: '1.5px solid var(--green)', fontFamily: 'Inter', fontSize: '.8rem', fontWeight: 600, color: 'var(--green)' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>

            <div style={row}><span style={{ color: 'var(--muted)' }}>Nom</span><span style={{ fontWeight: 600 }}>{order.nom}</span></div>
            {order.entreprise && <div style={row}><span style={{ color: 'var(--muted)' }}>Entreprise</span><span style={{ fontWeight: 600 }}>{order.entreprise}</span></div>}
            <div style={row}><span style={{ color: 'var(--muted)' }}>Téléphone</span><span style={{ fontWeight: 600 }}>+213{order.telephone}</span></div>
            {order.email && <div style={row}><span style={{ color: 'var(--muted)' }}>Email</span><span style={{ fontWeight: 600 }}>{order.email}</span></div>}
            <div style={row}><span style={{ color: 'var(--muted)' }}>Wilaya</span><span style={{ fontWeight: 600 }}>{order.wilaya}</span></div>
            <div style={row}><span style={{ color: 'var(--muted)' }}>Adresse</span><span style={{ fontWeight: 600, textAlign: 'right', maxWidth: 260 }}>{order.adresse}</span></div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontFamily: 'Anton', fontSize: '.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>📦 Produits</div>
            {(order.line_items || []).map((p, i) => {
              const szLine = Object.entries(p.sizes || {}).filter(([, v]) => +v > 0).map(([s, v]) => `${s}:${v}`).join(' · ')
              return (
                <div key={i} style={{ marginBottom: '.8rem', paddingBottom: '.8rem', borderBottom: i < order.line_items.length - 1 ? '1px solid var(--cream-border)' : 'none' }}>
                  <div style={row}><span>{p.emoji} {p.name} ({p.color}) × {p.qty}</span><span style={{ fontWeight: 600 }}>{(p.price * p.qty).toLocaleString('fr-DZ')} DA</span></div>
                  {szLine && <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{szLine}</div>}
                </div>
              )
            })}
            {order.technique && <div style={row}><span style={{ color: 'var(--muted)' }}>Technique</span><span style={{ fontWeight: 600 }}>{order.technique}</span></div>}
            {order.logo_filename && <div style={row}><span style={{ color: 'var(--muted)' }}>Logo</span><span style={{ fontWeight: 600 }}>{order.logo_filename}</span></div>}
            {order.notes && <div style={{ marginTop: '.8rem' }}><div style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '.3rem' }}>Notes</div><p style={{ fontSize: '.85rem' }}>{order.notes}</p></div>}
          </div>

          <div style={cardStyle}>
            <div style={row}><span style={{ color: 'var(--muted)' }}>Sous-total ({order.total_qty} pcs)</span><span>{order.subtotal.toLocaleString('fr-DZ')} DA</span></div>
            {order.volume_discount_amount > 0 && (
              <div style={row}><span style={{ color: 'var(--green)' }}>Remise volume ({(order.volume_discount_rate * 100).toFixed(0)}%)</span><span style={{ color: 'var(--green)' }}>−{order.volume_discount_amount.toLocaleString('fr-DZ')} DA</span></div>
            )}
            {order.payment_discount_amount > 0 && (
              <div style={row}><span style={{ color: 'var(--green)' }}>Remise paiement anticipé</span><span style={{ color: 'var(--green)' }}>−{order.payment_discount_amount.toLocaleString('fr-DZ')} DA</span></div>
            )}
            <div style={{ ...row, marginTop: '.6rem', paddingTop: '.6rem', borderTop: '1.5px solid var(--black)', fontFamily: 'Anton', fontSize: '1.1rem' }}>
              <span>TOTAL</span><span style={{ color: 'var(--green)' }}>{order.total.toLocaleString('fr-DZ')} DA</span>
            </div>
            <div style={{ marginTop: '.8rem', fontSize: '.8rem', color: 'var(--muted)' }}>
              Paiement : {{ livraison: 'À la livraison', ccp: 'CCP / Baridimob', cib: 'CIB / Edahabia' }[order.pay_mode]}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
