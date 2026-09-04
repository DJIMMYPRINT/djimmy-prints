# Réponses automatiques (Instagram / Facebook)

Les messages privés et les commentaires reçus sur la Page Facebook et le compte
Instagram professionnel reçoivent une **réponse immédiate**, puis sont renvoyés
vers WhatsApp. L'objectif est de tenir les premières minutes — pas de remplacer
la conversation : aucune réponse ne conclut une vente, toutes proposent WhatsApp.

## Les pièces

| Fichier | Rôle |
|---|---|
| `lib/autoreply.js` | Le cerveau. Reconnaît l'intention (prix, devis, minimum, délai, livraison, technique, échantillon, catalogue, commande, horaires, suivi, salutation, remerciement) et rédige la réponse. Ne connaît aucun réseau : du texte entre, du texte sort. |
| `lib/meta.js` | L'API Graph : vérification de signature, envoi des messages et des réponses aux commentaires. **Serveur uniquement.** |
| `pages/api/social/webhook.js` | Le point d'entrée déclaré chez Meta. |
| `pages/auto-reponses.js` | La console `/auto-reponses` : état du webhook, testeur, liste des règles. Page interne, `noindex`, absente de la navigation. |

Les prix, le minimum de commande, les techniques et les horaires cités dans les
réponses viennent de `lib/constants.js` et `lib/products.js` — **les mêmes
sources que les pages du site**. Un tarif ou une remise modifiée là se retrouve
automatiquement dans les réponses.

## Variables d'environnement (à définir dans Vercel)

| Variable | Où la trouver |
|---|---|
| `META_VERIFY_TOKEN` | Une chaîne que **vous inventez**, recopiée à l'identique dans Meta au moment de déclarer le webhook |
| `META_APP_SECRET` | Meta for Developers → votre app → Paramètres → Général → *Clé secrète* |
| `META_PAGE_ACCESS_TOKEN` | Jeton d'accès de la Page, avec les permissions `pages_messaging`, `pages_manage_engagement`, `instagram_manage_messages`, `instagram_manage_comments`. Prenez un jeton **permanent** : un jeton court expire au bout d'une heure |
| `META_PAGE_ID` / `META_IG_ID` | Facultatifs mais recommandés : ils évitent que le robot réponde à ses propres commentaires |
| `SOCIAL_AUTOREPLY` | `off` = **mode simulation** : les réponses sont calculées et tracées dans les logs, rien n'est publié |

Sans `META_APP_SECRET` et `META_PAGE_ACCESS_TOKEN`, le webhook répond
`503 { configured: false }` et n'envoie rien. **Une variable absente désactive
les réponses automatiques, elle ne casse jamais le site.**

> ⚠️ Ces valeurs sont des secrets : jamais de préfixe `NEXT_PUBLIC_`, jamais
> d'usage hors de `pages/api/`.

## Brancher le webhook

1. Déployez d'abord avec `SOCIAL_AUTOREPLY=off` (mode simulation).
2. Meta for Developers → votre app → **Webhooks** → *Instagram*, puis *Page*.
3. URL de rappel : `https://djimmyprints.xyz/api/social/webhook`
   Jeton de vérification : la valeur de `META_VERIFY_TOKEN`.
   Meta appelle l'URL en `GET` et attend le renvoi de son `hub.challenge`. Si la
   vérification échoue, vérifiez d'abord que la variable est présente **dans le
   déploiement en cours** — une variable ajoutée après coup exige un redéploiement.
4. Abonnez-vous aux champs `messages` et `comments` (Instagram), `messages` et
   `feed` (Page Facebook).
5. Ouvrez `/auto-reponses` : la pastille doit afficher « simulation ».
6. Écrivez-vous un message depuis un autre compte, relisez dans les logs Vercel
   ce que le robot *aurait* répondu, puis retirez `SOCIAL_AUTOREPLY=off` pour
   passer en « actif ».

## Ce que le webhook refuse de faire

- **Répondre sans signature valide.** Chaque évènement est vérifié avec
  `META_APP_SECRET` (HMAC SHA-256, comparaison à temps constant). Sans signature
  correcte : `401`, rien n'est envoyé. Un webhook public non vérifié, c'est
  n'importe qui qui fait écrire votre page.
- **Répondre deux fois.** Meta rejoue les évènements ; les identifiants déjà
  traités sont mémorisés 15 minutes.
- **Se répondre à lui-même.** Les commentaires venant de la Page ou du compte
  Instagram, et les échos de messages, sont ignorés — sinon la réponse du robot
  déclenche un nouvel évènement, en boucle.
- **Spammer.** Un même interlocuteur ne reçoit pas plus d'une réponse
  automatique par minute, et un commentaire vide, une simple mention ou une
  suite d'emoji ne déclenchent aucune réponse.

## Modifier les réponses

Tout est dans le tableau `RULES` de `lib/autoreply.js` : une règle = une clé,
une liste de mots-clés (français, arabe, derja latinisée) et deux textes —
`dm` (message privé, complet) et `comment` (réponse publique, courte). La règle
qui reconnaît le plus de mots-clés l'emporte ; une expression de plusieurs mots
pèse plus qu'un mot isolé (« combien de temps » l'emporte sur « combien »). Si
rien ne correspond, `FALLBACK` répond sans rien inventer et renvoie vers WhatsApp.

Après modification, vérifiez le rendu sur `/auto-reponses`, puis `npm run build`
avant de déployer.

## TikTok et LinkedIn

Seuls Instagram et Facebook ont un webhook. Pour les autres réseaux,
`/auto-reponses` sert de presse-papier : on colle le message reçu, on copie la
réponse proposée.
