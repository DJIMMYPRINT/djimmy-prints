import { createBrowserClient } from '@supabase/ssr'

let client

// Singleton so every page/component shares one auth session in the browser.
export function supabaseBrowser() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return client
}
