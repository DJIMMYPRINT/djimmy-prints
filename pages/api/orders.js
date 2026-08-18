import { supabaseAdmin } from '../../lib/supabaseClient'

// Called by the /commande wizard right before it opens wa.me, with the same
// structured order data used to build the WhatsApp message. This logs the
// customer's order intent into Supabase — it does not confirm the WhatsApp
// message was actually sent or received, just that the wizard was completed.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end()
    return
  }

  const { client, order, totals } = req.body || {}
  if (!client?.nom || !client?.tel || !Array.isArray(order?.prods) || order.prods.length === 0) {
    res.status(400).json({ error: 'Champs requis manquants.' })
    return
  }

  const { error } = await supabaseAdmin.from('orders').insert({
    nom: client.nom,
    entreprise: client.entreprise || null,
    tel: client.tel,
    email: client.email || null,
    wilaya: client.wilaya || null,
    adresse: client.adresse || null,
    produits: order.prods,
    technique: order.technique || null,
    logo_name: order.logoName || null,
    notes: order.notes || null,
    paiement: totals?.payLabel || null,
    quantite_totale: totals?.totalQty ?? null,
    sous_total: totals?.sub ?? null,
    total: totals?.final ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    res.status(500).json({ error: 'Insert failed' })
    return
  }

  res.status(200).json({ ok: true })
}
