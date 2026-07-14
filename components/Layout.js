import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Aurora from './Aurora'
import { WA, PHONE_DISPLAY, EMAIL, ADDRESS, SITE_URL } from '../lib/constants'

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => router.pathname === path

  return (
    <>
      <Aurora />

      {/* PROMO STRIP */}
      <div className="promo-strip" onClick={() => router.push('/commande')}>
        🎁 Commandez 50 pièces ou plus — Remise volume automatique · Livraison partout en Algérie
      </div>

      {/* NAV */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '.8rem 4vw',
        borderBottom: scrolled ? '1px solid var(--cream-border)' : '1px solid transparent',
        background: scrolled ? 'rgba(245,240,232,.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
        transition: 'all .4s',
        marginTop: '36px',
      }}>
        {/* Brand */}
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'.7rem',textDecoration:'none'}}>
          <img src="/djimmy-logo.png" alt="Djimmy Prints" style={{width:48,height:48,objectFit:'contain',borderRadius:'50%'}} />
          <span style={{fontFamily:'Anton',fontSize:'1.25rem',letterSpacing:'.03em',color:'var(--black)',textTransform:'uppercase'}}>
            DJIMMY <span style={{color:'var(--green)'}}>PRINTS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-desktop-links" style={{display:'flex',gap:0,listStyle:'none',alignItems:'center',margin:0}}>
          {[
            { label: 'Accueil', href: '/' },
            { label: 'Catalogue', href: '/catalogue' },
            { label: 'Commande', href: '/commande' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <li key={href}>
              <Link href={href} style={{
                color: isActive(href) ? 'var(--black)' : 'var(--muted)',
                textDecoration: 'none',
                fontSize: '.75rem',
                fontWeight: 500,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                padding: '.45rem 1.1rem',
                display: 'block',
                position: 'relative',
                borderBottom: isActive(href) ? '1.5px solid var(--green)' : 'none',
                transition: 'color .2s',
              }}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={`https://wa.me/${WA}?text=Bonjour Djimmy Prints, je souhaite un devis.`}
              target="_blank" rel="noopener noreferrer"
              style={{
                background: 'var(--green)',
                color: 'var(--white)',
                borderRadius: '2px',
                padding: '.45rem 1.3rem',
                fontSize: '.75rem',
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginLeft: '.5rem',
                transition: 'background .2s',
                display: 'inline-block',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--green-l)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--green)'}
            >
              Devis Gratuit
            </a>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          className={`nav-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="mobile-menu-panel">
          {[
            { label: 'Accueil', href: '/' },
            { label: 'Catalogue', href: '/catalogue' },
            { label: 'Commande', href: '/commande' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className={isActive(href) ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <a
            className="mm-cta"
            href={`https://wa.me/${WA}?text=Bonjour Djimmy Prints, je souhaite un devis.`}
            target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            💬 Devis Gratuit sur WhatsApp
          </a>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main style={{position:'relative',zIndex:1}}>
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{
        background: 'var(--black)',
        color: 'var(--cream)',
        padding: '4rem 4vw 2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem'}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'1rem'}}>
              <img src="/djimmy-logo.png" alt="Djimmy Prints" style={{width:44,height:44,objectFit:'contain',borderRadius:'50%'}} />
              <span style={{fontFamily:'Anton',fontSize:'1.1rem',letterSpacing:'.05em',textTransform:'uppercase'}}>
                DJIMMY <span style={{color:'var(--green-l)'}}>PRINTS</span>
              </span>
            </div>
            <p style={{fontSize:'.85rem',color:'rgba(245,240,232,.55)',lineHeight:1.8,maxWidth:280}}>
              Impression professionnelle sur uniformes et tenues de travail. Broderie, sérigraphie, transfert numérique. Livraison partout en Algérie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(245,240,232,.4)',marginBottom:'1rem'}}>Navigation</p>
            {[['Accueil','/'],['Catalogue','/catalogue'],['Commander','/commande'],['Contact','/contact']].map(([label,href]) => (
              <Link key={href} href={href} style={{display:'block',fontSize:'.85rem',color:'rgba(245,240,232,.6)',textDecoration:'none',marginBottom:'.5rem',transition:'color .2s'}}
                onMouseOver={e=>e.currentTarget.style.color='var(--cream)'}
                onMouseOut={e=>e.currentTarget.style.color='rgba(245,240,232,.6)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <p style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(245,240,232,.4)',marginBottom:'1rem'}}>Services</p>
            {['Broderie','Sérigraphie','Transfert numérique','Sublimation','Flocage'].map(s => (
              <p key={s} style={{fontSize:'.85rem',color:'rgba(245,240,232,.6)',marginBottom:'.5rem'}}>{s}</p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(245,240,232,.4)',marginBottom:'1rem'}}>Contact</p>
            <p style={{fontSize:'.85rem',color:'rgba(245,240,232,.6)',marginBottom:'.5rem'}}>📍 {ADDRESS}</p>
            <p style={{fontSize:'.85rem',color:'rgba(245,240,232,.6)',marginBottom:'.5rem'}}>📞 {PHONE_DISPLAY}</p>
            <p style={{fontSize:'.85rem',color:'rgba(245,240,232,.6)',marginBottom:'1rem'}}>📧 {EMAIL}</p>
            <a
              href={`https://wa.me/${WA}`}
              target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'.4rem',background:'#25D366',color:'#fff',padding:'.5rem 1.1rem',borderRadius:'3px',fontSize:'.78rem',fontWeight:700,textDecoration:'none'}}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div style={{borderTop:'1px solid rgba(245,240,232,.08)',paddingTop:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
          <span style={{fontSize:'.75rem',color:'rgba(245,240,232,.3)'}}>© 2026 Djimmy Prints — {ADDRESS}</span>
          <span style={{fontSize:'.75rem',color:'rgba(245,240,232,.3)'}}>{SITE_URL}</span>
        </div>
      </footer>
    </>
  )
}
