import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { requireAdminSession } from '../../../lib/supabase/requireAdminSession'

const STATUS_LABEL = {
  nouvelle: 'Nouvelle', confirmee: 'Confirmée', en_production: 'En production',
  livree: 'Livrée', annulee: 'Annulée',
}
const STATUS_COLOR = {
  nouvelle: 'var(--gold)', confirmee: 'var(--green)', en_production: 'var(--green)',
  livree: 'var(--muted)', annulee: '#B23A3A',
}

export async function getServerSideProps(ctx) {
  const session = await requireAdminSession(ctx)
  if (session.redirect) return session
  const { data: orders } = await session.supabase.from('orders').select('*').order('created_at', { ascending: false })
  return { props: { orders: orders ?? [] } }
}

export default function AdminOrders({ orders }) {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <>
      <Head><title>Commandes — Admin Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 4vw', borderBottom: '1px solid var(--cream-border)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.85rem' }}>← Admin</Link>
            <span style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase' }}>Commandes</span>
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '.5rem .8rem', borderRadius: '4px', border: '1.5px solid var(--cream-border)', fontFamily: 'Inter', fontSize: '.8rem' }}>
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div style={{ padding: '2rem 4vw' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {shown.map(o => (
              <Link key={o.id} href={`/admin/commandes/${o.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.8rem',
                background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px',
                padding: '1rem 1.5rem', textDecoration: 'none', color: 'var(--black)',
              }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.nom}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                    {new Date(o.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })} · {o.wilaya}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <span style={{ fontFamily: 'Anton', color: 'var(--green)' }}>{o.total.toLocaleString('fr-DZ')} DA</span>
                  <span style={{
                    fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
                    color: STATUS_COLOR[o.status] || 'var(--muted)', border: `1.5px solid ${STATUS_COLOR[o.status] || 'var(--muted)'}`,
                    borderRadius: '100px', padding: '.25rem .7rem',
                  }}>{STATUS_LABEL[o.status] || o.status}</span>
                </div>
              </Link>
            ))}
            {shown.length === 0 && <p style={{ color: 'var(--muted)' }}>Aucune commande.</p>}
          </div>
        </div>
      </div>
    </>
  )
}
