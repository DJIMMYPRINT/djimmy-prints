// Server-only Supabase client — uses the service role key, which bypasses
// row-level security. Never import this from a page component or anything
// that ends up in the client bundle; only from API routes and
// getServerSideProps.
//
// Built lazily (not at module load) so `next build`'s page-data collection
// — which imports every page, including ones using getServerSideProps —
// doesn't crash in environments where the env vars aren't set yet.
import { createClient } from '@supabase/supabase-js'

let cached = null

export function getSupabaseAdmin() {
  if (!cached) {
    cached = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  return cached
}
