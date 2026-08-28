import Head from 'next/head'
import Link from 'next/link'
import { WA, VOLUME_DISCOUNTS } from '../lib/constants'

const AVANTAGES = [
  { ic: '👤', title: 'Compte dédié', desc: 'Un seul interlocuteur pour toutes vos commandes, du devis à la livraison.' },
  { ic: '🧾', title: 'Facturation entreprise', desc: 'Facture avec numéro fiscal sur demande, pour votre comptabilité.' },
  { ic: '📦', title: 'Tarifs dégressifs', desc: 'Jusqu\'à -15% dès 200 pièces, appliqué automatiquement sur votre devis.' },
  { ic: '🚚', title: 'Livraison 58 wilayas', desc: 'À domicile ou en stop desk, partout en Algérie.' },
]

const SECTEURS = ['Restauration & Hôtellerie', 'BTP & Industrie', 'Santé & Beauté', 'Sécurité & Gardiennage', 'Commerce & Retail', 'Éducation & Associations']

const ETAPES = [
  { n: '01', title: 'Devis personnalisé', desc: 'Décrivez votre besoin (produits, quantités, logo) sur WhatsApp ou via le configurateur.' },
  { n: '02', title: 'Validation & BAT', desc: 'Nous confirmons les prix, délais et vous envoyons un bon à tirer avant production.' },
  { n: '03', title: 'Production & livraison', desc: 'Impression ou broderie, contrôle qualité, puis livraison à l\'adresse de votre choix.' },
]

export default function Entreprises() {
  const waMsg = encodeURIComponent('Bonjour Djimmy Prints, je représente une entreprise et je souhaite un devis pour équiper mes équipes.')

  return (
    <>
      <Head>
        <title>Solutions Entreprises — Djimmy Prints</title>
        <meta name="description" content="Uniformes et tenues de travail personnalisés pour entreprises. Compte dédié, tarifs dégressifs, facturation, livraison 58 wilayas." />
      </Head>

      {/* HERO */}
      <div style={{padding:'9rem 4vw 3rem',position:'relative',zIndex:1}}>
        <p className="s-lbl">Solutions entreprises</p>
        <h1 className="s-ttl">Équipez vos équipes, <span className="kw">à votre image</span></h1>
        <p className="s-desc">Devis rapide, compte dédié, tarifs dégressifs sur volume. Djimmy Prints accompagne les entreprises, hôtels, restaurants et chantiers partout en Algérie.</p>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginTop:'2rem'}}>
          <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn-g">
            💬 Demander un devis entreprise
          </a>
          <Link href="/catalogue" className="btn-outline">Voir le catalogue</Link>
        </div>
      </div>

      {/* AVANTAGES */}
      <div style={{padding:'2rem 4vw 4rem',position:'relative',zIndex:1}}>
        <div className="ent-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.2rem'}}>
          {AVANTAGES.map(a => (
            <div key={a.title} style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'10px',padding:'1.6rem 1.4rem'}}>
              <div style={{fontSize:'1.8rem',marginBottom:'.8rem'}}>{a.ic}</div>
              <div style={{fontFamily:'Anton',fontSize:'.9rem',textTransform:'uppercase',letterSpacing:'.02em',marginBottom:'.4rem'}}>{a.title}</div>
              <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.6}}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* REMISES VOLUME */}
      <div style={{padding:'0 4vw 4rem',position:'relative',zIndex:1}}>
        <h2 className="s-ttl" style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',marginBottom:'1.5rem'}}>Tarifs <span className="kw">dégressifs</span></h2>
        <div className="ent-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
          {VOLUME_DISCOUNTS.map(d => (
            <div key={d.qty} style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'10px',padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontFamily:'Anton',fontSize:'2rem',color:'var(--green)'}}>{d.dis}</div>
              <div style={{fontSize:'.8rem',fontWeight:700,margin:'.4rem 0'}}>{d.qty} pièces</div>
              <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT CA MARCHE */}
      <div style={{padding:'0 4vw 4rem',position:'relative',zIndex:1}}>
        <h2 className="s-ttl" style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',marginBottom:'2rem'}}>Comment ça <span className="kw">marche</span></h2>
        <div className="ent-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'2rem'}}>
          {ETAPES.map(e => (
            <div key={e.n}>
              <div style={{fontFamily:'Anton',fontSize:'2.2rem',color:'var(--muted-light)',marginBottom:'.5rem'}}>{e.n}</div>
              <div style={{fontFamily:'Anton',fontSize:'1rem',textTransform:'uppercase',marginBottom:'.5rem'}}>{e.title}</div>
              <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTEURS */}
      <div style={{padding:'0 4vw 4rem',position:'relative',zIndex:1}}>
        <h2 className="s-ttl" style={{fontSize:'clamp(1.5rem,3vw,2.2rem)',marginBottom:'1.5rem'}}>Secteurs <span className="kw">servis</span></h2>
        <div style={{display:'flex',gap:'.7rem',flexWrap:'wrap'}}>
          {SECTEURS.map(s => (
            <span key={s} style={{background:'var(--green-pale)',color:'var(--green)',padding:'.6rem 1.2rem',borderRadius:'100px',fontSize:'.8rem',fontWeight:600}}>{s}</span>
          ))}
        </div>
      </div>

      {/* CTA FINALE */}
      <div style={{padding:'0 4vw 6rem',position:'relative',zIndex:1}}>
        <div style={{background:'var(--green)',borderRadius:'12px',padding:'3rem 2rem',textAlign:'center'}}>
          <div style={{fontFamily:'Anton',fontSize:'1.5rem',textTransform:'uppercase',color:'var(--cream)',marginBottom:'.6rem'}}>
            Prêt à équiper vos équipes ?
          </div>
          <p style={{fontSize:'.9rem',color:'rgba(245,240,232,.8)',marginBottom:'1.8rem',maxWidth:480,marginLeft:'auto',marginRight:'auto'}}>
            Décrivez votre besoin, nous revenons vers vous avec un devis sous 24h.
          </p>
          <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:'var(--cream)',color:'var(--green)',padding:'1rem 2.2rem',fontWeight:700,fontSize:'.85rem',letterSpacing:'.05em',textTransform:'uppercase',borderRadius:'3px',textDecoration:'none'}}>
            💬 Contacter un conseiller
          </a>
        </div>
      </div>
    </>
  )
}
