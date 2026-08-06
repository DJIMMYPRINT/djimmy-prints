import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

// Server-side Supabase client for use inside getServerSideProps, reading/writing
// the auth session cookie on the Pages Router req/res pair.
export function supabaseServer({ req, res }) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? '')
        },
        setAll(cookiesToSet) {
          const existing = res.getHeader('Set-Cookie')
          const prev = existing ? (Array.isArray(existing) ? existing : [existing]) : []
          res.setHeader('Set-Cookie', [
            ...prev,
            ...cookiesToSet.map(({ name, value, options }) => serializeCookieHeader(name, value, options)),
          ])
        },
      },
    }
  )
}
