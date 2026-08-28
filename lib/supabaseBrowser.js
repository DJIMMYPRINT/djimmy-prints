// Browser-side Supabase client for customer accounts (Auth only — the anon
// key is meant to be public, it's paired with the RLS policy on `orders`
// that restricts reads to `user_id = auth.uid()`). Built lazily for the
// same reason as lib/supabaseAdmin.js: don't crash pages that import this
// when the env vars aren't set yet.
import { createClient } from '@supabase/supabase-js'

let cached = null

export function getSupabaseBrowser() {
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return cached
}
