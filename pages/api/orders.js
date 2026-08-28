import { getSupabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    nom, entreprise, tel, email, wilaya, adresse,
    produits, technique, logoName, notes, paiement,
    quantiteTotale, sousTotal, total,
  } = req.body || {}

  if (!nom || !tel || !Array.isArray(produits) || produits.length === 0) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .insert({
      nom, tel,
      entreprise: entreprise || null,
      email: email || null,
      wilaya: wilaya || null,
      adresse: adresse || null,
      produits,
      technique: technique || null,
      logo_name: logoName || null,
      notes: notes || null,
      paiement: paiement || null,
      quantite_totale: quantiteTotale ?? null,
      sous_total: sousTotal ?? null,
      total: total ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('orders insert failed', error)
    return res.status(500).json({ error: 'Insertion échouée' })
  }

  return res.status(200).json({ id: data.id })
}
