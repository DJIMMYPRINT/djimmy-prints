import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseClient'
import { parseOrderMessage } from '../../../lib/parseOrderMessage'

// Meta signs the raw POST body — verifying that signature requires the
// exact bytes Meta sent, so the default JSON body parser (which would
// re-serialize and lose the original formatting) must stay off here.
export const config = { api: { bodyParser: false } }

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function isValidSignature(rawBody, signatureHeader, appSecret) {
  if (!signatureHeader || !appSecret) return false
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
  const sigBuf = Buffer.from(signatureHeader)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length) return false
  return crypto.timingSafeEqual(sigBuf, expBuf)
}

function extractMessageRows(body) {
  const rows = []
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {}
      const contacts = value.contacts || []
      for (const message of value.messages || []) {
        if (message.type !== 'text') continue
        const text = message.text?.body || ''
        const parsed = parseOrderMessage(text)
        const contact = contacts.find((c) => c.wa_id === message.from)
        rows.push({
          wa_message_id: message.id,
          from_phone: message.from,
          contact_name: contact?.profile?.name || null,
          raw_text: text,
          is_order: parsed.isOrder,
          order_details: parsed.isOrder ? parsed : null,
          received_at: new Date(Number(message.timestamp) * 1000).toISOString(),
        })
      }
    }
  }
  return rows
}

export default async function handler(req, res) {
  // Meta calls this with GET once, to confirm you control the endpoint.
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge)
    } else {
      res.status(403).end()
    }
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    res.status(405).end()
    return
  }

  const rawBody = await readRawBody(req)

  if (!isValidSignature(rawBody, req.headers['x-hub-signature-256'], process.env.WHATSAPP_APP_SECRET)) {
    res.status(401).end()
    return
  }

  let body
  try {
    body = JSON.parse(rawBody.toString('utf8'))
  } catch {
    res.status(400).end()
    return
  }

  // Meta expects a fast 200 and will retry (and eventually disable the
  // webhook) if it doesn't get one, so a DB hiccup is logged, not thrown.
  try {
    const rows = extractMessageRows(body)
    if (rows.length > 0) {
      const { error } = await supabaseAdmin
        .from('whatsapp_orders')
        .upsert(rows, { onConflict: 'wa_message_id' })
      if (error) console.error('Supabase insert error:', error)
    }
  } catch (err) {
    console.error('WhatsApp webhook processing error:', err)
  }

  res.status(200).end()
}
