import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { requireAdminSession } from '../../lib/supabase/requireAdminSession'
import { supabaseBrowser } from '../../lib/supabase/browserClient'

export async function getServerSideProps(ctx) {
  const session = await requireAdminSession(ctx)
  if (session.redirect) return session
  return { props: {} }
}

export default function AdminDashboard() {
  const router = useRouter()

  const logout = async () => {
    await supabaseBrowser().auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      <Head><title>Admin — Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 4vw', borderBottom: '1px solid var(--cream-border)' }}>
          <span style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase' }}>Djimmy <span style={{ color: 'var(--green)' }}>Admin</span></span>
          <button onClick={logout} className="btn-outline" style={{ padding: '.5rem 1.2rem', fontSize: '.75rem' }}>Déconnexion</button>
        </div>

        <div style={{ padding: '3rem 4vw', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', maxWidth: 700 }}>
          <Link href="/admin/produits" style={{ display: 'block', background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px', padding: '2rem', textDecoration: 'none', color: 'var(--black)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.8rem' }}>🧢</div>
            <div style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '.3rem' }}>Produits</div>
            <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Catalogue, prix, photos</div>
          </Link>
          <Link href="/admin/commandes" style={{ display: 'block', background: 'var(--white)', border: '1.5px solid var(--cream-border)', borderRadius: '8px', padding: '2rem', textDecoration: 'none', color: 'var(--black)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.8rem' }}>📦</div>
            <div style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '.3rem' }}>Commandes</div>
            <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Commandes reçues via le site</div>
          </Link>
        </div>
      </div>
    </>
  )
}
