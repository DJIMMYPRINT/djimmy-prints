import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non authentifié' })

  const admin = getSupabaseAdmin()
  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Session invalide' })
  }

  const { data, error } = await admin
    .from('orders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('account orders fetch failed', error)
    return res.status(500).json({ error: 'Chargement échoué' })
  }

  return res.status(200).json({ orders: data })
}
