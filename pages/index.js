import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const WA = '213560836384'
const WA_MSG = encodeURIComponent('Bonjour Djimmy Prints, je souhaite un devis pour des uniformes.')

const SERVICES = [
  { ic: '🪡', name: 'Broderie', desc: 'Rendu premium, idéal pour logos, textes et armoiries sur col, poitrine ou manche.' },
  { ic: '🖨️', name: 'Sérigraphie', desc: 'Impression haute résistance sur grandes surfaces. Parfaite pour commandes en volume.' },
  { ic: '💻', name: 'Transfert numérique', desc: 'Reproduction fidèle de votre logo avec couleurs exactes. Délai rapide.' },
  { ic: '🌈', name: 'Sublimation', desc: 'Couleurs vibrantes et durables sur polyester. Idéal pour sportswear.' },
  { ic: '🔤', name: 'Flocage', desc: 'Lettrage en velours ou flex pour un look sport authentique.' },
  { ic: '📦', name: 'Livraison Algérie', desc: 'Livraison à domicile ou stop desk dans les 58 wilayas.' },
]

const WHY = [
  { n: '48H', t: 'Délai de traitement', d: 'Confirmation et mise en production sous 48h ouvrables.' },
  { n: '58', t: 'Wilayas livrées', d: 'Couverture nationale complète, domicile ou stop desk.' },
  { n: '20+', t: 'Pièces minimum', d: 'Accessible aux petites et grandes structures.' },
  { n: '100%', t: 'Sur mesure', d: 'Vos couleurs, votre logo, votre identité.' },
]

const TESTIMONIALS = [
  { text: "Qualité impeccable et livraison rapide. Nos employés sont fiers de porter les uniformes Djimmy Prints.", author: "Karim B.", role: "Gérant restaurant, Alger" },
  { text: "Le configurateur en ligne est génial — on a pu visualiser nos logos avant de commander. Très professionnel.", author: "Soraya M.", role: "Directrice hôtel, Oran" },
  { text: "Prix compétitifs, excellent suivi. On renouvelle nos commandes chaque saison sans hésiter.", author: "Yazid T.", role: "DRH PME industrielle, Annaba" },
]

export default function Home() {
  const rvRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.15 }
    )
    rvRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const rv = (i) => (el) => { rvRefs.current[i] = el }

  return (
    <>
      <Head>
        <title>Djimmy Prints — Uniformes Personnalisés Alger | Broderie Algérie</title>
        <meta name="description" content="Djimmy Prints — Impression professionnelle sur uniformes et tenues de travail à Alger. Broderie, sérigraphie, transfert numérique. Devis gratuit sous 24h." />
        <meta property="og:title" content="Djimmy Prints — Fait pour ceux qui rêvent grand" />
        <meta property="og:description" content="Broderie, sérigraphie, transfert numérique sur uniformes. Livraison partout en Algérie." />
      </Head>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '9rem 4vw 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{maxWidth: 860, position: 'relative', zIndex: 1}}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.6rem',
            background: 'var(--green-pale)', border: '1px solid rgba(45,90,39,.2)',
            padding: '.4rem 1rem', borderRadius: '100px',
            fontSize: '.72rem', fontWeight: 600, letterSpacing: '.12em',
            textTransform: 'uppercase', color: 'var(--green)', marginBottom: '2rem',
          }}>
            <span style={{width:6,height:6,background:'var(--green)',borderRadius:'50%',animation:'blk 2s infinite'}} />
            Impression textile professionnelle · Alger
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Anton', fontWeight: 400,
            fontSize: 'clamp(2.8rem, 8vw, 6.2rem)',
            lineHeight: 1.03, textTransform: 'uppercase',
            letterSpacing: '.005em', marginBottom: '1.8rem', color: 'var(--black)',
          }}>
            Fait pour ceux<br/>
            <span style={{color: 'var(--green)'}}>qui rêvent grand.</span>
          </h1>

          <p style={{
            fontSize: '1.05rem', color: 'var(--muted)',
            lineHeight: 1.85, maxWidth: 500, marginBottom: '2.8rem',
          }}>
            Uniformes brodés, sérigraphiés, personnalisés à votre image.
            Livraison dans les <strong style={{color:'var(--black)'}}>58 wilayas</strong> d'Algérie.
            Devis gratuit en moins de 24h.
          </p>

          {/* CTAs */}
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'4rem'}}>
            <Link href="/commande" className="btn-g">
              Commander maintenant
            </Link>
            <Link href="/catalogue" className="btn-outline">
              Voir le catalogue
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '3rem', paddingTop: '2.2rem',
            borderTop: '1.5px solid var(--cream-border)', flexWrap: 'wrap',
          }}>
            {[['500+','Clients satisfaits'],['48H','Délai de traitement'],['58','Wilayas livrées'],['5+','Techniques d\'impression']].map(([n,l]) => (
              <div key={l}>
                <div style={{fontFamily:'Anton',fontSize:'2.6rem',fontWeight:400,color:'var(--green)',lineHeight:1}}>{n}</div>
                <div style={{fontSize:'.72rem',color:'var(--muted)',letterSpacing:'.07em',marginTop:'.3rem',fontWeight:500,textTransform:'uppercase'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="mqw">
        <div className="mqt">
          {[...Array(2)].map((_, i) => (
            ['Broderie','Sérigraphie','Transfert Numérique','Sublimation','Flocage','Livraison Nationale','Devis 24H'].map((item) => (
              <span key={`${i}-${item}`} className="mqi">
                {item}<span className="mqd"/>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section ref={rv(0)} className="rv" style={{padding:'5.5rem 4vw',background:'rgba(255,255,255,.5)',backdropFilter:'blur(6px)',position:'relative',zIndex:1}}>
        <p className="s-lbl">Nos techniques</p>
        <h2 className="s-ttl">Ce qu'on fait <span className="kw">mieux que tout le monde</span></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem',marginTop:'3rem'}}>
          {SERVICES.map((s, i) => (
            <div key={s.name} ref={rv(10 + i)} className="rv" style={{
              background: 'var(--cream)', border: '1.5px solid var(--cream-border)',
              padding: '2.2rem 1.8rem', borderRadius: '6px',
              transition: 'all .3s', cursor: 'default',
              transitionDelay: `${i * 0.08}s`,
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--cream-border)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
            >
              <span style={{fontSize:'1.8rem',marginBottom:'1.1rem',display:'block'}}>{s.ic}</span>
              <div style={{fontFamily:'Anton',fontSize:'1.15rem',textTransform:'uppercase',letterSpacing:'.02em',marginBottom:'.5rem'}}>{s.name}</div>
              <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section ref={rv(1)} className="rv" style={{padding:'5.5rem 4vw',position:'relative',zIndex:1}}>
        <p className="s-lbl">Pourquoi Djimmy Prints</p>
        <h2 className="s-ttl">Des chiffres qui <span className="kw">parlent d'eux-mêmes</span></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',marginTop:'3rem'}}>
          {WHY.map((w, i) => (
            <div key={w.n} ref={rv(20 + i)} className="rv" style={{
              padding:'1.8rem 1.5rem', border:'1.5px solid var(--cream-border)',
              borderRadius:'6px', background:'var(--white)', transition:'all .3s',
              transitionDelay:`${i*0.08}s`,
            }}
              onMouseOver={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow)'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='var(--cream-border)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
            >
              <div style={{fontFamily:'Anton',fontSize:'2.6rem',fontWeight:400,color:'var(--green)',lineHeight:1}}>{w.n}</div>
              <div style={{fontWeight:700,fontSize:'.9rem',margin:'.4rem 0',color:'var(--black)'}}>{w.t}</div>
              <p style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.7}}>{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section ref={rv(2)} className="rv" style={{
        background:'var(--green)', padding:'4rem 4vw',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:'2rem', flexWrap:'wrap', position:'relative', overflow:'hidden', zIndex:1,
      }}>
        <div style={{position:'absolute',right:'-1rem',top:'50%',transform:'translateY(-50%)',fontFamily:'Anton',fontSize:'7rem',fontWeight:400,color:'rgba(255,255,255,.07)',whiteSpace:'nowrap',pointerEvents:'none'}}>
          DJIMMY PRINTS
        </div>
        <div>
          <div style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(1.6rem,3.5vw,2.5rem)',textTransform:'uppercase',color:'var(--cream)',lineHeight:1}}>
            Prêt à habiller votre équipe ?
          </div>
          <p style={{fontSize:'.88rem',color:'rgba(245,240,232,.75)',marginTop:'.4rem'}}>
            Devis gratuit · Réponse sous 24h · Livraison dans 58 wilayas
          </p>
        </div>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',position:'relative',zIndex:1}}>
          <Link href="/commande" style={{
            background:'var(--cream)',color:'var(--green)',
            padding:'.9rem 2.2rem',fontWeight:700,fontSize:'.85rem',
            letterSpacing:'.07em',textTransform:'uppercase',border:'none',
            borderRadius:'3px',cursor:'pointer',fontFamily:'Inter',
            transition:'all .2s',textDecoration:'none',display:'inline-block',
          }}>
            Commander
          </Link>
          <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
            style={{
              background:'transparent',color:'var(--cream)',
              padding:'.9rem 2.2rem',fontWeight:600,fontSize:'.85rem',
              letterSpacing:'.07em',textTransform:'uppercase',
              border:'1.5px solid rgba(245,240,232,.4)',
              borderRadius:'3px',cursor:'pointer',fontFamily:'Inter',
              transition:'all .2s',textDecoration:'none',display:'inline-block',
            }}>
            💬 WhatsApp
          </a>
        </div>
      </section>


      {/* ── GALERIE RÉALISATIONS ── */}
      <section ref={rv(5)} className="rv" style={{padding:'5.5rem 4vw',background:'rgba(255,255,255,.5)',backdropFilter:'blur(6px)',position:'relative',zIndex:1}}>
        <p className="s-lbl">Nos réalisations</p>
        <h2 className="s-ttl">Travail <span className="kw">concret, résultats réels</span></h2>
        <p className="s-desc">Hôpitaux, restaurants, entreprises industrielles — voici ce qu'on livre.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1rem',marginTop:'3rem'}}>
          {[
            {src:'https://ivxvzyokijsatdlonpec.supabase.co/storage/v1/object/public/Image/IMG_0590.jpeg', label:'Réalisation client — Impression professionnelle', tag:'Transfert numérique'},
            {src:'https://ivxvzyokijsatdlonpec.supabase.co/storage/v1/object/public/Image/IMG_0591.jpeg', label:'Réalisation client — Logo personnalisé', tag:'Sérigraphie'},
            {src:'https://ivxvzyokijsatdlonpec.supabase.co/storage/v1/object/public/Image/IMG_0592.jpeg', label:'Réalisation client — Uniforme complet', tag:'Broderie'},
            {src:'/photo1.png', label:'Ambulancier · Établissement Hospitalier Rouane', tag:'Transfert numérique'},
            {src:'/photo5.jpg', label:'Milano Food · Polo noir logo couleur', tag:'Transfert numérique'},
            {src:'/photo6.jpg', label:'FBI Emballage · Gilet multi-poches', tag:'Sérigraphie'},
          ].map((p,i) => (
            <div key={i} ref={rv(40+i)} className="rv" style={{
              borderRadius:'8px',overflow:'hidden',
              border:'1.5px solid var(--cream-border)',
              background:'var(--white)',
              transition:'all .3s',
              transitionDelay:`${i*0.07}s`,
            }}
              onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-md)'}}
              onMouseOut={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
            >
              <div style={{aspectRatio:'4/3',overflow:'hidden',background:'var(--cream)'}}>
                <img src={p.src} alt={p.label}
                  style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .4s'}}
                  onMouseOver={e=>e.currentTarget.style.transform='scale(1.04)'}
                  onMouseOut={e=>e.currentTarget.style.transform='none'}
                />
              </div>
              <div style={{padding:'1rem 1.2rem'}}>
                <span style={{fontSize:'.65rem',background:'var(--green-pale)',color:'var(--green)',padding:'.2rem .6rem',borderRadius:'100px',fontWeight:600}}>{p.tag}</span>
                <p style={{fontSize:'.82rem',color:'var(--muted)',marginTop:'.5rem',lineHeight:1.5}}>{p.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */
      <section ref={rv(3)} className="rv" style={{padding:'5.5rem 4vw',position:'relative',zIndex:1}}>
        <p className="s-lbl">Témoignages</p>
        <h2 className="s-ttl">Ils nous font <span className="kw">confiance</span></h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem',marginTop:'3rem'}}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} ref={rv(30+i)} className="rv" style={{
              background:'var(--white)',border:'1.5px solid var(--cream-border)',
              borderRadius:'6px',padding:'2rem',transition:'all .3s',
              transitionDelay:`${i*0.1}s`,
            }}>
              <div style={{color:'var(--gold)',fontSize:'1.1rem',marginBottom:'1rem'}}>★★★★★</div>
              <p style={{fontSize:'.9rem',color:'var(--black-soft)',lineHeight:1.8,marginBottom:'1.2rem',fontStyle:'italic'}}>"{t.text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:'.8rem'}}>
                <div style={{width:38,height:38,background:'var(--green)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--white)',fontWeight:700,fontSize:'.9rem',flexShrink:0}}>
                  {t.author[0]}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:'.85rem'}}>{t.author}</div>
                  <div style={{fontSize:'.75rem',color:'var(--muted)'}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.2} }
      `}</style>
    </>
  )
}
