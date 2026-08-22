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

  const { client, order, totals, payMode } = req.body || {}
  if (!client?.nom || !client?.tel || !Array.isArray(order?.prods) || order.prods.length === 0) {
    res.status(400).json({ error: 'Champs requis manquants.' })
    return
  }

  // Column names match the pre-existing `orders` table in this Supabase
  // project (see supabase/orders.sql), not the field names used in the
  // wizard's own state (e.g. `tel` -> `telephone`, `logoName` -> `logo_filename`).
  const { error } = await supabaseAdmin.from('orders').insert({
    status: 'nouveau',
    nom: client.nom,
    telephone: client.tel,
    entreprise: client.entreprise || null,
    email: client.email || null,
    wilaya: client.wilaya || null,
    adresse: client.adresse || null,
    technique: order.technique || null,
    logo_filename: order.logoName || null,
    notes: order.notes || null,
    line_items: order.prods,
    pay_mode: payMode || null,
    subtotal: totals?.sub ?? null,
    volume_discount_rate: totals?.disRate ?? null,
    volume_discount_amount: totals?.volDis ?? null,
    payment_discount_amount: totals?.payDis ?? null,
    total_qty: totals?.totalQty ?? null,
    total: totals?.final ?? null,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    res.status(500).json({ error: 'Insert failed' })
    return
  }

  res.status(200).json({ ok: true })
}
