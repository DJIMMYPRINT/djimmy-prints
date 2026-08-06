import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { requireAdminSession } from '../../../lib/supabase/requireAdminSession'
import { supabaseBrowser } from '../../../lib/supabase/browserClient'

export async function getServerSideProps(ctx) {
  const session = await requireAdminSession(ctx)
  if (session.redirect) return session
  const { data: products } = await session.supabase.from('products').select('*').order('sort_order')
  return { props: { products: products ?? [] } }
}

export default function AdminProducts({ products }) {
  const router = useRouter()

  const remove = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est définitive.`)) return
    const { error } = await supabaseBrowser().from('products').delete().eq('id', id)
    if (error) { alert('Erreur : ' + error.message); return }
    router.replace(router.asPath)
  }

  return (
    <>
      <Head><title>Produits — Admin Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 4vw', borderBottom: '1px solid var(--cream-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.85rem' }}>← Admin</Link>
            <span style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase' }}>Produits</span>
          </div>
          <Link href="/admin/produits/nouveau" className="btn-g" style={{ padding: '.6rem 1.4rem', fontSize: '.78rem' }}>+ Nouveau produit</Link>
        </div>

        <div style={{ padding: '2rem 4vw', display: 'flex', flexDirection: 'column', gap: '.8rem', maxWidth: 900 }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.6rem' }}>{p.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name} {p.popular && <span style={{ fontSize: '.65rem', color: 'var(--gold)', fontWeight: 700, marginLeft: '.4rem' }}>★ POPULAIRE</span>}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{p.id} · {p.photo}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'Anton', color: 'var(--green)' }}>{p.price.toLocaleString('fr-DZ')} DA</span>
                <Link href={`/admin/produits/${p.id}`} className="btn-outline" style={{ padding: '.4rem 1rem', fontSize: '.72rem' }}>Modifier</Link>
                <button onClick={() => remove(p.id, p.name)} style={{ border: 'none', background: 'none', color: '#B23A3A', cursor: 'pointer', fontSize: '.85rem' }}>Supprimer</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p style={{ color: 'var(--muted)' }}>Aucun produit.</p>}
        </div>
      </div>
    </>
  )
}
