// Exporte les règles de lib/autoreply.js au format « flow Chatfuel ».
//
//   node scripts/export-chatfuel.mjs           → aperçu lisible
//   node scripts/export-chatfuel.mjs --json    → JSON (pour la page de copie)
//
// Chatfuel n'a pas d'import de flows : on recrée les déclencheurs à la main
// dans son interface. Ce script évite la recopie à l'aveugle — les mots-clés
// et les textes sortent de la même source que les réponses du site, donc un
// tarif changé dans lib/constants.js se retrouve ici sans réécriture.
//
// Chatfuel compare les mots-clés en « contient », sans notion de score : une
// règle trop générique capterait les messages des autres. Les mots-clés sont
// donc filtrés — on retire ceux de deux caractères ou moins, et ceux qu'une
// règle plus précise revendique déjà (« min » pour minimum, par exemple).

import { RULES, FALLBACK, buildReply } from '../lib/autoreply.js'

// Un mot-clé trop court ou trop commun dans Chatfuel déclenche à tort.
const TROP_COURT = 3
const AMBIGUS = new Set(['min', 'chal', 'cc', 'hi', 'top', 'photo', 'detail', 'unite'])

function keywordsPourChatfuel(rule) {
  const forts = new Set((rule.strong || []).map(k => k.toLowerCase()))
  return rule.keywords
    .filter(k => k.length >= TROP_COURT && !AMBIGUS.has(k.toLowerCase()))
    // Les mots sans ambiguïté d'abord : dans Chatfuel, l'ordre des règles
    // décide qui répond en cas de double correspondance.
    .sort((a, b) => (forts.has(b.toLowerCase()) ? 1 : 0) - (forts.has(a.toLowerCase()) ? 1 : 0))
}

// Les textes sont produits par buildReply, pas en appelant les gabarits à la
// main : c'est la même fonction que le webhook, donc l'export ne peut pas
// diverger de ce que le site répondrait.
//
// Deux ajustements pour Chatfuel :
//  • le prénom est rendu via un pseudo-témoin, remplacé ensuite par la
//    variable {{first name}} que Chatfuel substitue à l'envoi ;
//  • la génération est datée d'un dimanche matin, donc pendant les horaires :
//    la mention « hors horaires » du site n'a pas d'équivalent ici, Chatfuel
//    ne sait pas la calculer.
const TEMOIN = 'Prenomtemoin'
const PENDANT_LES_HORAIRES = new Date('2026-09-06T09:00:00Z') // dimanche 10h à Alger

function texte(message, channel) {
  return buildReply(message, { channel, name: TEMOIN, now: PENDANT_LES_HORAIRES })
    .text.replaceAll(TEMOIN, '{{first name}}')
}

export function pack() {
  return [...RULES, FALLBACK].map((rule, i) => {
    // Un message qui contient le premier mot-clé de la règle la déclenche :
    // c'est le moyen le plus sûr de rendre le texte réellement associé.
    const echantillon = rule.keywords[0] || 'xyz abc'
    return {
      ordre: i + 1,
      cle: rule.key,
      titre: rule.label,
      quand: rule.hint,
      motsCles: keywordsPourChatfuel(rule),
      dm: texte(echantillon, 'dm'),
      commentaire: texte(echantillon, 'comment'),
      repli: rule.key === FALLBACK.key,
    }
  })
}

if (process.argv[1] && process.argv[1].endsWith('export-chatfuel.mjs')) {
  const data = pack()
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(data, null, 2))
  } else {
    for (const f of data) {
      console.log(`\n━━ ${f.ordre}. ${f.titre}${f.repli ? '  (règle attrape-tout, à mettre en dernier)' : ''}`)
      console.log(`   Déclencheur : ${f.motsCles.join(', ') || '— aucun : réponse par défaut —'}`)
      console.log(`   ── Message privé ──\n${f.dm}`)
      console.log(`   ── Réponse au commentaire ──\n${f.commentaire}`)
    }
  }
}
