import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { WA, SUPABASE_IMG_BASE, VOLUME_DISCOUNTS } from '../lib/constants'
import { fetchProducts } from '../lib/supabase/fetchProducts'

export async function getServerSideProps(ctx) {
  const products = await fetchProducts(ctx)
  return { props: { products } }
}

export default function Home({ products }) {
  const [selected, setSelected] = useState(products[0])

  if (!selected) {
    return (
      <div style={{padding:'9rem 4vw 5rem',textAlign:'center',position:'relative',zIndex:1}}>
        <p className="s-desc">Aucun produit disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Catalogue — Djimmy Prints | Uniformes & Tenues de travail Algérie</title>
        <meta name="description" content="Catalogue complet Djimmy Prints — Polos, T-shirts, Combinaisons, Gilets, Vestes personnalisés. Prix en DA, livraison 58 wilayas." />
      </Head>

      {/* HEADER */}
      <div style={{padding:'9rem 4vw 3rem',position:'relative',zIndex:1}}>
        <p className="s-lbl">Catalogue produits</p>
        <h1 className="s-ttl">Nos <span className="kw">tenues professionnelles</span></h1>
        <p className="s-desc">Tous nos produits sont personnalisables avec votre logo. Prix unitaires affichés — remises volume disponibles.</p>
      </div>

      <div style={{padding:'0 4vw 6rem',position:'relative',zIndex:1}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:'4rem',alignItems:'start'}}>

          {/* GAUCHE — Liste produits */}
          <div>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {products.map(p => (
                <div key={p.id} onClick={()=>setSelected(p)} style={{
                  background: selected.id===p.id ? 'var(--green-pale)' : 'var(--white)',
                  border: `1.5px solid ${selected.id===p.id ? 'var(--green)' : 'var(--cream-border)'}`,
                  borderRadius:'10px', padding:'1.2rem 1.5rem',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  cursor:'pointer', transition:'all .2s', position:'relative',
                }}>
                  {p.popular && (
                    <span style={{position:'absolute',top:'-10px',right:'12px',background:'var(--gold)',color:'#fff',fontSize:'.62rem',fontWeight:700,padding:'.2rem .7rem',borderRadius:'100px',letterSpacing:'.08em',textTransform:'uppercase'}}>
                      Populaire
                    </span>
                  )}
                  <div style={{display:'flex',alignItems:'center',gap:'1.2rem'}}>
                    {/* Product image thumbnail */}
                    <div style={{width:64,height:64,borderRadius:'8px',overflow:'hidden',background:'var(--cream)',flexShrink:0,border:'1px solid var(--cream-border)'}}>
                      <img src={`${SUPABASE_IMG_BASE}/${p.photo}`} alt={p.name}
                        style={{width:'100%',height:'100%',objectFit:'cover'}}
                        onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.8rem">${p.emoji}</div>`}}
                      />
                    </div>
                    <div>
                      <div style={{fontFamily:'Anton',fontSize:'.95rem',textTransform:'uppercase',letterSpacing:'.02em',marginBottom:'.2rem'}}>{p.name}</div>
                      <div style={{fontSize:'.75rem',color:'var(--muted)',maxWidth:300,lineHeight:1.4}}>{p.desc.substring(0,70)}...</div>
                      <div style={{display:'flex',gap:'.4rem',marginTop:'.4rem',flexWrap:'wrap'}}>
                        {p.techniques.map(t=>(
                          <span key={t} style={{fontSize:'.62rem',background:'var(--green-pale)',color:'var(--green)',padding:'.15rem .5rem',borderRadius:'100px',fontWeight:600}}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0,marginLeft:'1rem'}}>
                    <div style={{fontFamily:'Anton',fontSize:'1.5rem',color:'var(--green)',lineHeight:1}}>{p.price.toLocaleString('fr-DZ')}</div>
                    <div style={{fontSize:'.7rem',color:'var(--muted)'}}>DA / pièce</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DROITE — Détail produit */}
          <div style={{position:'sticky',top:'120px'}}>
            <div style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'12px',overflow:'hidden'}}>

              {/* Image principale */}
              <div style={{aspectRatio:'1',background:'var(--cream)',position:'relative',overflow:'hidden'}}>
                <img
                  key={selected.photo}
                  src={`${SUPABASE_IMG_BASE}/${selected.photo}`}
                  alt={selected.name}
                  style={{width:'100%',height:'100%',objectFit:'cover',transition:'opacity .3s'}}
                  onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:6rem">${selected.emoji}</div>`}}
                />
                {selected.popular && (
                  <div style={{position:'absolute',top:12,left:12,background:'var(--gold)',color:'#fff',fontSize:'.65rem',fontWeight:700,padding:'.3rem .8rem',borderRadius:'100px',letterSpacing:'.08em',textTransform:'uppercase'}}>
                    Populaire
                  </div>
                )}
              </div>

              {/* Infos produit */}
              <div style={{padding:'1.5rem'}}>
                <h2 style={{fontFamily:'Anton',fontSize:'1.3rem',textTransform:'uppercase',letterSpacing:'.02em',marginBottom:'.4rem'}}>{selected.name}</h2>
                <div style={{fontFamily:'Anton',fontSize:'2.2rem',color:'var(--green)',lineHeight:1,marginBottom:'.3rem'}}>{selected.price.toLocaleString('fr-DZ')} <span style={{fontSize:'1rem',color:'var(--muted)'}}>DA/u</span></div>
                <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7,marginBottom:'1.2rem'}}>{selected.desc}</p>

                <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
                  {selected.techniques.map(t=>(
                    <span key={t} style={{fontSize:'.72rem',background:'var(--green-pale)',color:'var(--green)',padding:'.25rem .7rem',borderRadius:'100px',fontWeight:600}}>{t}</span>
                  ))}
                </div>

                <Link href={`/commande?produit=${selected.id}`} style={{
                  display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem',
                  background:'var(--green)',color:'#fff',
                  padding:'1rem',borderRadius:'8px',fontWeight:700,
                  fontSize:'.9rem',textDecoration:'none',
                  letterSpacing:'.05em',textTransform:'uppercase',
                  transition:'all .2s',marginBottom:'.8rem',
                  boxShadow:'0 4px 16px rgba(45,90,39,.2)',
                }}>
                  Commander ce produit
                </Link>

                <a href={`https://wa.me/${WA}?text=Bonjour, je suis intéressé par : ${selected.name} (${selected.price.toLocaleString()} DA/u). Pouvez-vous me faire une offre ?`}
                  target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem',background:'#25D366',color:'#fff',padding:'1rem',borderRadius:'8px',fontWeight:700,fontSize:'.9rem',textDecoration:'none',letterSpacing:'.05em',textTransform:'uppercase'}}>
                  💬 Demander un devis WhatsApp
                </a>
              </div>
            </div>

            {/* Remises volume */}
            <div style={{background:'var(--white)',border:'1.5px solid var(--cream-border)',borderRadius:'12px',overflow:'hidden',marginTop:'1rem'}}>
              <div style={{padding:'1rem 1.2rem',borderBottom:'1px solid var(--cream-border)',fontFamily:'Anton',fontSize:'.85rem',textTransform:'uppercase',letterSpacing:'.04em'}}>
                📦 Remises volume
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
                {VOLUME_DISCOUNTS.map((d,i)=>(
                  <div key={d.qty} style={{padding:'.8rem .5rem',textAlign:'center',borderRight:i<3?'1px solid var(--cream-border)':'none'}}>
                    <div style={{fontFamily:'Anton',fontSize:'1.1rem',color:i>0?'var(--green)':'var(--muted)',lineHeight:1}}>{d.dis}</div>
                    <div style={{fontSize:'.65rem',fontWeight:700,color:'var(--black)',margin:'.2rem 0'}}>{d.qty}</div>
                    <div style={{fontSize:'.6rem',color:'var(--muted)'}}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
