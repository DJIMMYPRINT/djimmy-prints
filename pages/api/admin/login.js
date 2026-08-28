import { buildAdminCookie } from '../../../lib/adminAuth'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body || {}
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  res.setHeader('Set-Cookie', buildAdminCookie())
  return res.status(200).json({ ok: true })
}
