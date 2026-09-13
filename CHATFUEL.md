# Réponses automatiques via Chatfuel

Deux chemins existent dans ce dépôt pour répondre automatiquement sur Instagram
et Facebook. Celui-ci est le chemin **sans code côté Meta**.

| | Webhook maison (`AUTO-REPONSES.md`) | Chatfuel |
|---|---|---|
| Mise en service | app Meta + App Review pour `instagram_manage_messages` | connexion du compte en OAuth, quelques minutes |
| Coût | aucun | abonnement mensuel (l'outil de réponse aux commentaires reste gratuit) |
| Textes | générés à l'exécution depuis `lib/constants.js` et `lib/products.js` | collés à la main, régénérés par le script ci-dessous |
| Hors horaires | mention ajoutée automatiquement | pas d'équivalent |

Les deux se valent selon l'urgence : Chatfuel démarre tout de suite, le webhook
ne coûte rien et reste synchronisé avec le catalogue sans intervention.

## Générer le pack de flows

```bash
node scripts/export-chatfuel.mjs          # aperçu lisible dans le terminal
node scripts/export-chatfuel.mjs --json   # JSON (alimente la page de copie)
```

Le script rejoue `buildReply()` — la fonction qu'utilise le webhook — donc les
textes exportés sont exactement ceux que le site enverrait. Deux différences
assumées, imposées par Chatfuel :

- l'accroche devient `{{first name}}`, la variable que Chatfuel remplace à
  l'envoi (elle reste vide si le contact n'a pas de prénom renseigné) ;
- la mention « hors horaires » est retirée : Chatfuel ne sait pas calculer
  l'heure d'Alger, l'export est donc daté d'un dimanche matin ouvré.

Les mots-clés sont filtrés au passage. Chatfuel compare en « contient », sans
score : les mots de moins de trois caractères et une poignée de termes trop
ambigus (`min`, `photo`, `top`…) sont écartés, sinon ils captureraient les
messages destinés à une autre règle.

## Recréer les flows

Chatfuel n'importe pas de fichier : chaque déclencheur se crée à la main, dans
l'ordre donné par l'export.

1. Connectez le compte Instagram professionnel **djimmyprints** (relié à la Page
   Facebook) dans *Connect channel*.
2. Un flow par ligne de l'export, dans l'ordre : `Keyword` pour les messages
   privés, `Comment on post` pour les commentaires.
3. Le texte « message privé » va dans *Send message*, le texte « réponse au
   commentaire » dans *Reply to comment*.
4. **La règle `defaut` vient en dernier** : elle n'a aucun mot-clé et attrape
   tout ce que les treize autres n'ont pas reconnu. Placée avant, elle
   répondrait à la place de toutes les autres.
5. Testez depuis un autre compte — « chhal », « livraison Oran », puis un
   message sans rapport — et vérifiez que c'est bien le repli qui répond au
   dernier.

## Quand un tarif change

`lib/products.js` ou `lib/constants.js` modifié → relancez le script et recollez
les textes des flows concernés (prix, minimum, horaires). Rien ne se met à jour
tout seul côté Chatfuel : c'est le prix à payer pour ne pas gérer d'app Meta.
