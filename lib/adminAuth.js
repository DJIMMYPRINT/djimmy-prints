// Minimal signed-cookie session for the internal /admin back-office.
// One shared password (ADMIN_PASSWORD), no per-user accounts — this gates
// staff access to the orders list, it is not the customer-facing account
// system.
import crypto from 'crypto'

const COOKIE_NAME = 'djimmy_admin'
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8h

function hmac(data) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(data).digest('hex')
}

export function buildAdminCookie() {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000
  const sig = hmac(String(exp))
  const value = encodeURIComponent(`${exp}.${sig}`)
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=${value}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}

export function isAdminRequest(req) {
  const raw = req.cookies?.[COOKIE_NAME]
  if (!raw) return false
  const [exp, sig] = decodeURIComponent(raw).split('.')
  if (!exp || !sig || Date.now() > Number(exp)) return false
  try {
    const expected = hmac(exp)
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}
