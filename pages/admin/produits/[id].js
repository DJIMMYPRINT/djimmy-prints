import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { requireAdminSession } from '../../../lib/supabase/requireAdminSession'
import { supabaseBrowser } from '../../../lib/supabase/browserClient'

const EMPTY = { id: '', name: '', emoji: '', photo: '', price: '', description: '', techniques: '', popular: false, sort_order: 0 }

export async function getServerSideProps(ctx) {
  const session = await requireAdminSession(ctx)
  if (session.redirect) return session

  const { id } = ctx.params
  if (id === 'nouveau') return { props: { isNew: true, product: EMPTY } }

  const { data: product } = await session.supabase.from('products').select('*').eq('id', id).single()
  if (!product) return { notFound: true }
  return { props: { isNew: false, product: { ...product, techniques: (product.techniques || []).join(', ') } } }
}

const inputStyle = {
  width: '100%', padding: '.7rem 1rem', border: '1.5px solid var(--cream-border)',
  borderRadius: '4px', fontSize: '.9rem', fontFamily: 'Inter',
  background: 'var(--white)', color: 'var(--black)', outline: 'none',
}
const labelStyle = { display: 'block', fontSize: '.75rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }
const field = { marginBottom: '1.1rem' }

export default function AdminProductForm({ isNew, product }) {
  const router = useRouter()
  const [form, setForm] = useState(product)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.id || !form.name || !form.photo || !form.price) { setError('Identifiant, nom, photo et prix sont obligatoires.'); return }

    setSaving(true)
    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      emoji: form.emoji.trim(),
      photo: form.photo.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      techniques: form.techniques.split(',').map(t => t.trim()).filter(Boolean),
      popular: !!form.popular,
      sort_order: Number(form.sort_order) || 0,
    }

    const supabase = supabaseBrowser()
    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', product.id)

    setSaving(false)
    if (error) { setError(error.message); return }
    router.push('/admin/produits')
  }

  return (
    <>
      <Head><title>{isNew ? 'Nouveau produit' : `Modifier — ${product.name}`} — Admin Djimmy Prints</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 4vw', borderBottom: '1px solid var(--cream-border)' }}>
          <Link href="/admin/produits" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '.85rem' }}>← Produits</Link>
          <span style={{ fontFamily: 'Anton', fontSize: '1.1rem', textTransform: 'uppercase' }}>{isNew ? 'Nouveau produit' : `Modifier ${product.name}`}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem 4vw', maxWidth: 560 }}>
          <div className="two-col-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={field}>
              <label style={labelStyle}>Identifiant (slug) *</label>
              <input style={inputStyle} value={form.id} onChange={set('id')} disabled={!isNew} placeholder="ex: polo" />
            </div>
            <div style={field}>
              <label style={labelStyle}>Emoji</label>
              <input style={inputStyle} value={form.emoji} onChange={set('emoji')} placeholder="👕" />
            </div>
          </div>

          <div style={field}>
            <label style={labelStyle}>Nom *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} />
          </div>

          <div className="two-col-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={field}>
              <label style={labelStyle}>Photo (fichier dans le bucket IMAGE) *</label>
              <input style={inputStyle} value={form.photo} onChange={set('photo')} placeholder="polo1.jpeg" />
            </div>
            <div style={field}>
              <label style={labelStyle}>Prix (DA) *</label>
              <input type="number" min="0" style={inputStyle} value={form.price} onChange={set('price')} />
            </div>
          </div>

          <div style={field}>
            <label style={labelStyle}>Description</label>
            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={set('description')} />
          </div>

          <div style={field}>
            <label style={labelStyle}>Techniques (séparées par des virgules)</label>
            <input style={inputStyle} value={form.techniques} onChange={set('techniques')} placeholder="Broderie, Sérigraphie" />
          </div>

          <div className="two-col-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <div style={field}>
              <label style={labelStyle}>Ordre d'affichage</label>
              <input type="number" style={inputStyle} value={form.sort_order} onChange={set('sort_order')} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem', fontWeight: 600, marginTop: '1.2rem' }}>
              <input type="checkbox" checked={!!form.popular} onChange={set('popular')} /> Populaire
            </label>
          </div>

          {error && <p style={{ color: '#B23A3A', fontSize: '.82rem', margin: '1rem 0' }}>{error}</p>}

          <button type="submit" disabled={saving} className="btn-g" style={{ marginTop: '1rem', opacity: saving ? .7 : 1 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </>
  )
}
