import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const SB = 'https://ivxvzyokijsatdlonpec.supabase.co/storage/v1/object/public/IMAGE'

const PRODUCTS = [
  {
    id: 'polo', emoji: '👔', name: 'Polo Personnalisé', price: 2400,
    desc: 'Piqué coton 220g/m². Col côtelé, fermeture 3 boutons. Logo brodé ou imprimé recto/verso.',
    techniques: ['Broderie', 'Sérigraphie', 'Transfert'], popular: true,
    images: [`${SB}/polo1.jpeg`, `${SB}/polo2.png`, `${SB}/polo3.png`]
  },
  {
    id: 'tshirt', emoji: '👕', name: 'T-shirt Personnalisé', price: 1950,
    desc: 'Coton 180g/m². Col rond renforcé. Impression haute résolution recto/verso.',
    techniques: ['Sérigraphie', 'Transfert', 'Sublimation'],
    images: [`${SB}/tshirt1.jpeg`, `${SB}/tshirtbeie2.jpeg`]
  },
  {
    id: 'combinaison', emoji: '🦺', name: 'Combinaison Personnalisée', price: 4900,
    desc: 'Tissu professionnel résistant. Multi-poches, bretelles réglables. Idéal industrie & BTP.',
    techniques: ['Broderie', 'Sérigraphie'], popular: true,
    images: [`${SB}/combinaison1.png`, `${SB}/combinaison2.jpeg`]
  },
  {
    id: 'veste', emoji: '🧥', name: 'Veste de Travail', price: 3000,
    desc: 'Tissu robuste multi-poches. Logo brodé poitrine et dos. Idéal équipes terrain.',
    techniques: ['Broderie', 'Transfert'],
    images: [`${SB}/veste1.jpeg`]
  },
  {
    id: 'gilet', emoji: '🦺', name: 'Gilet Avec Col', price: 2700,
    desc: 'Gilet professionnel avec col zippé. Multi-poches. Broderie ou impression logo.',
    techniques: ['Broderie', 'Sérigraphie'],
    images: [`${SB}/gilet1.jpeg`, `${SB}/gilet2.jpeg`]
  },
  {
    id: 'gilet-sans', emoji: '🦺', name: 'Gilet Sans Col', price: 2300,
    desc: 'Gilet léger sans col, zippé. Confort optimal. Personnalisation logo incluse.',
    techniques: ['Broderie', 'Sérigraphie'],
    images: [`${SB}/gilet1.jpeg`]
  },
  {
    id: 'tablier', emoji: '🥼', name: 'Tablier / Blouse', price: 2200,
    desc: 'Blouse professionnelle coton. Idéal secteur médical, restauration, beauté.',
    techniques: ['Broderie', 'Transfert'],
    images: [`${SB}/tablier1.jpeg`]
  },
  {
    id: 'casquette', emoji: '🧢', name: 'Casquette Brodée', price: 1150,
    desc: 'Coton structuré 6 panneaux. Broderie haute définition. Taille réglable.',
    techniques: ['Broderie'],
    images: [`${SB}/casquette1.png`]
  },
  {
    id: 'pantalon', emoji: '👖', name: 'Pantalon de Travail', price: 2500,
    desc: 'Tissu pro résistant. Multi-poches cargo. Tailles S→3XL. Logo brodé ou imprimé.',
    techniques: ['Broderie', 'Transfert'],
    images: [`${SB}/combinaison2.jpeg`]
  },
]

const VOLUME_DISCOUNTS = [
  { qty: '20–49', dis: '0%', label: 'Tarif standard', color: 'var(--muted)' },
  { qty: '50–99', dis: '5%', label: 'Remise volume', color: 'var(--green)' },
  { qty: '100–199', dis: '10%', label: 'Remise pro', color: 'var(--green)' },
  { qty: '200+', dis: '15%', label: 'Tarif entreprise', color: 'var(--green)' },
]

export default function Catalogue() {
  const [selected, setSelected] = useState(PRODUCTS[0])
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => { setImgIdx(0) }, [selected])

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
              {PRODUCTS.map(p => (
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
                      <img src={p.images[0]} alt={p.name}
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
                  key={selected.images[imgIdx]}
                  src={selected.images[imgIdx]}
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

              {/* Thumbnails */}
              {selected.images.length > 1 && (
                <div style={{display:'flex',gap:'.5rem',padding:'.8rem',borderBottom:'1px solid var(--cream-border)'}}>
                  {selected.images.map((img,i)=>(
                    <div key={i} onClick={()=>setImgIdx(i)} style={{
                      width:52,height:52,borderRadius:'6px',overflow:'hidden',cursor:'pointer',flexShrink:0,
                      border:`2px solid ${imgIdx===i?'var(--green)':'var(--cream-border)'}`,
                      background:'var(--cream)',
                    }}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}
                        onError={e=>{e.target.style.display='none'}}
                      />
                    </div>
                  ))}
                </div>
              )}

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

                <a href={`https://wa.me/213560836384?text=Bonjour, je suis intéressé par : ${selected.name} (${selected.price.toLocaleString()} DA/u). Pouvez-vous me faire une offre ?`}
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
                    <div style={{fontFamily:'Anton',fontSize:'1.1rem',color:d.color,lineHeight:1}}>{d.dis}</div>
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
