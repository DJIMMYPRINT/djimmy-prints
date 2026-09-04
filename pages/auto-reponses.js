import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { WA, PHONE_DISPLAY, SITE_URL } from '../lib/constants'
import { RULES, FALLBACK, buildReply, isOpenNow } from '../lib/autoreply'

// Console des réponses automatiques (page de travail, pas une page vitrine).
//
// Elle sert à deux choses :
//  1. Voir et tester ce que le robot répond avant de le brancher — on tape
//     un message de client, on lit la réponse.
//  2. Répondre à la main sur les réseaux qui n'ont pas d'API branchée
//     (TikTok, LinkedIn) : on colle le message, on copie la réponse.
//
// Elle est en `noindex` et absente de la navigation : c'est un outil interne,
// pas une page de vente.

const EXAMPLES = [
  'Bonjour, chhal polo brodé pour 60 personnes ?',
  'Vous faites une seule pièce ?',
  'السلام عليكم، بشحال التيشيرت؟',
  'Livraison à Oran c\'est combien de temps ?',
  'Vous avez des photos de vos réalisations ?',
  'Vous êtes ouverts vendredi ?',
]

const card = {
  background: 'var(--white)',
  border: '1.5px solid var(--cream-border)',
  borderRadius: '8px',
  padding: '1.6rem',
}

const field = {
  width: '100%',
  padding: '.85rem 1rem',
  border: '1.5px solid var(--cream-border)',
  borderRadius: '4px',
  fontSize: '.92rem',
  fontFamily: 'inherit',
  background: 'var(--white)',
  color: 'var(--black)',
  outline: 'none',
}

const mono = { fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace" }

const pill = (active) => ({
  padding: '.55rem 1.2rem',
  borderRadius: '3px',
  fontSize: '.78rem',
  fontWeight: 600,
  letterSpacing: '.05em',
  cursor: 'pointer',
  fontFamily: 'inherit',
  border: '1.5px solid var(--green)',
  background: active ? 'var(--green)' : 'transparent',
  color: active ? 'var(--white)' : 'var(--green)',
})

export default function AutoReponses() {
  const [message, setMessage] = useState(EXAMPLES[0])
  const [channel, setChannel] = useState('dm')
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState(null)
  const [open, setOpen] = useState(null)

  // L'état du webhook vient du serveur : c'est le déploiement qui sait si les
  // variables d'environnement sont réellement présentes.
  useEffect(() => {
    let alive = true
    fetch('/api/social/webhook')
      .then(r => r.json())
      .then(d => { if (alive) setStatus(d) })
      .catch(() => { if (alive) setStatus({ error: true }) })
    // isOpenNow dépend de l'heure : calculée après le montage pour ne pas
    // faire diverger le HTML rendu par le serveur et le premier rendu client.
    setOpen(isOpenNow())
    return () => { alive = false }
  }, [])

  const reply = useMemo(
    () => buildReply(message, { channel, name }),
    [message, channel, name],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reply.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* presse-papier refusé (http, permission) — le texte reste sélectionnable */
    }
  }

  const badge = !status ? ['…', 'var(--muted)']
    : status.error ? ['injoignable', '#B3261E']
    : status.mode === 'actif' ? ['actif', 'var(--green)']
    : status.mode === 'simulation' ? ['simulation', 'var(--gold)']
    : ['inactif', 'var(--muted)']

  return (
    <>
      <Head>
        <title>Réponses automatiques — Djimmy Prints</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{padding:'9rem 4vw 5rem',position:'relative',zIndex:1,maxWidth:820}}>
        <p className="s-lbl">Outil interne</p>
        <h1 className="s-ttl">Réponses <span className="kw">automatiques</span></h1>
        <p className="s-desc">
          Les messages privés et les commentaires Instagram / Facebook reçoivent une
          réponse immédiate, puis sont renvoyés vers WhatsApp. Testez ici ce que le
          robot répond — ou copiez la réponse pour l'envoyer à la main.
        </p>

        {/* ── ÉTAT DU WEBHOOK ── */}
        <div style={{...card, marginTop:'3rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'.6rem',flexWrap:'wrap'}}>
            <span style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--muted)'}}>
              Webhook Meta
            </span>
            <span style={{fontSize:'.8rem',fontWeight:700,color:badge[1]}}>● {badge[0]}</span>
          </div>
          <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.8,marginTop:'.8rem'}}>
            {!status || status.error
              ? 'État du serveur indisponible.'
              : status.mode === 'actif'
                ? 'Les réponses partent automatiquement sur Instagram et Facebook.'
                : status.mode === 'simulation'
                  ? 'SOCIAL_AUTOREPLY=off : les réponses sont calculées et tracées dans les logs, mais rien n\'est publié.'
                  : 'Variables META_APP_SECRET / META_PAGE_ACCESS_TOKEN absentes — le webhook refuse les évènements. Voir AUTO-REPONSES.md.'}
          </p>
          <p style={{...mono,fontSize:'.75rem',color:'var(--muted-light)',marginTop:'.7rem',overflowWrap:'anywhere'}}>
            URL à déclarer chez Meta : https://{SITE_URL}/api/social/webhook
          </p>
          {open === false && (
            <p style={{fontSize:'.8rem',color:'var(--gold)',marginTop:'.7rem',fontWeight:600}}>
              🕐 Nous sommes hors horaires : les réponses privées le mentionnent automatiquement.
            </p>
          )}
        </div>

        {/* ── TESTEUR ── */}
        <div style={{...card, marginTop:'1.2rem'}}>
          <div style={{display:'flex',gap:'.6rem',marginBottom:'1.2rem',flexWrap:'wrap'}}>
            <button onClick={() => setChannel('dm')} style={pill(channel === 'dm')}>💬 Message privé</button>
            <button onClick={() => setChannel('comment')} style={pill(channel === 'comment')}>💭 Commentaire</button>
          </div>

          <label style={{fontSize:'.78rem',fontWeight:600,color:'var(--muted)',display:'block',marginBottom:'.4rem'}}>
            Message du client
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            style={{...field, resize:'vertical'}}
            placeholder="Collez le message reçu…"
          />

          <label style={{fontSize:'.78rem',fontWeight:600,color:'var(--muted)',display:'block',margin:'1rem 0 .4rem'}}>
            Pseudo / prénom (facultatif)
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={field}
            placeholder="karim.dz"
          />

          <div style={{display:'flex',flexWrap:'wrap',gap:'.45rem',marginTop:'1rem'}}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setMessage(ex)} style={{
                fontSize:'.75rem',padding:'.35rem .8rem',borderRadius:'100px',cursor:'pointer',
                border:'1px solid var(--cream-border)',background:'var(--cream)',color:'var(--muted)',fontFamily:'inherit',
              }}>
                {ex.length > 34 ? ex.slice(0, 33) + '…' : ex}
              </button>
            ))}
          </div>

          {/* Réponse */}
          <div style={{marginTop:'1.6rem',borderTop:'1.5px solid var(--cream-border)',paddingTop:'1.4rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'.8rem',flexWrap:'wrap'}}>
              <span style={{fontSize:'.8rem',color:'var(--muted)'}}>
                Intention détectée :{' '}
                <strong style={{color: reply.score > 0 ? 'var(--green)' : 'var(--muted-light)'}}>
                  {reply.label}
                </strong>
                {reply.ref && <span style={{...mono,color:'var(--muted-light)'}}> · {reply.ref}</span>}
              </span>
              <button onClick={copy} className="btn-outline" style={{padding:'.5rem 1.1rem',fontSize:'.72rem'}}>
                {copied ? '✓ Copié' : 'Copier'}
              </button>
            </div>

            {reply.skipped ? (
              <p style={{fontSize:'.88rem',color:'#B3261E',marginTop:'1rem',lineHeight:1.8}}>
                Message vide, simple mention ou emoji seul : le robot ne répond pas.
                C'est volontaire — mieux vaut le silence qu'une réponse hors sujet
                sous votre publication.
              </p>
            ) : (
              <pre style={{
                whiteSpace:'pre-wrap',wordBreak:'break-word',marginTop:'1rem',
                background:'var(--cream)',border:'1.5px solid var(--cream-border)',borderRadius:'6px',
                padding:'1.1rem',fontSize:'.88rem',lineHeight:1.8,color:'var(--black-soft)',
                fontFamily:'inherit',
              }}>
                {reply.text}
              </pre>
            )}
            <p style={{fontSize:'.75rem',color:'var(--muted-light)',marginTop:'.6rem'}}>
              {reply.text.length} caractères · {channel === 'comment'
                ? 'réponse publique sous le commentaire, suivie d\'un message privé plus complet'
                : 'réponse envoyée en message privé'}
            </p>
          </div>
        </div>

        {/* ── RÈGLES ── */}
        <h2 className="s-ttl" style={{fontSize:'1.6rem',marginTop:'4rem'}}>
          Les {RULES.length + 1} <span className="kw">règles</span>
        </h2>
        <p className="s-desc">
          Chaque règle compte les mots-clés reconnus dans le message (français, arabe
          et derja latinisée) ; la mieux notée l'emporte. Pour changer un texte ou
          ajouter un mot-clé : <span style={mono}>lib/autoreply.js</span>.
        </p>

        <div style={{display:'grid',gap:'.9rem',marginTop:'2rem'}}>
          {[...RULES, FALLBACK].map(rule => (
            <div key={rule.key} style={{...card, padding:'1.2rem 1.4rem'}}>
              <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:'.8rem',flexWrap:'wrap'}}>
                <strong style={{fontSize:'1rem',fontFamily:'Anton',textTransform:'uppercase',letterSpacing:'.03em',fontWeight:400}}>
                  {rule.label}
                </strong>
                <span style={{...mono,fontSize:'.72rem',color:'var(--muted-light)'}}>{rule.key}</span>
              </div>
              <p style={{fontSize:'.85rem',color:'var(--muted)',marginTop:'.4rem'}}>{rule.hint}</p>
              {rule.keywords.length > 0 && (
                <p style={{fontSize:'.78rem',color:'var(--muted-light)',marginTop:'.6rem',lineHeight:1.8}}>
                  {rule.keywords.slice(0, 10).join(' · ')}
                  {rule.keywords.length > 10 && ` · +${rule.keywords.length - 10}`}
                </p>
              )}
              <button
                onClick={() => setMessage(rule.keywords[0] ? `Bonjour, ${rule.keywords[0]} ?` : 'Bonjour')}
                style={{
                  marginTop:'.8rem',fontSize:'.74rem',padding:'.35rem .85rem',borderRadius:'100px',
                  border:'1px solid var(--cream-border)',background:'var(--cream)',color:'var(--green)',
                  cursor:'pointer',fontFamily:'inherit',fontWeight:600,
                }}>
                Tester cette règle
              </button>
            </div>
          ))}
        </div>

        {/* ── RAPPEL ── */}
        <div style={{...card, marginTop:'2rem', background:'var(--cream-dark)'}}>
          <p style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.9}}>
            La réponse automatique fait gagner les premières minutes, elle ne conclut
            rien : chaque message renvoie vers WhatsApp ({PHONE_DISPLAY}), qui reste
            le canal où la commande se traite.
          </p>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="btn-g"
             style={{marginTop:'1.2rem'}}>
            💬 Ouvrir WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
