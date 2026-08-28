import { clearAdminCookie } from '../../../lib/adminAuth'

export default function handler(req, res) {
  res.setHeader('Set-Cookie', clearAdminCookie())
  return res.status(200).json({ ok: true })
}
