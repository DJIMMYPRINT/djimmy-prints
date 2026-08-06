import { supabaseServer } from './serverClient'

// Shared getServerSideProps guard for /admin/* pages: redirects to login when
// there's no session, otherwise hands back the authenticated server client.
export async function requireAdminSession(ctx) {
  const supabase = supabaseServer(ctx)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  return { supabase, user }
}
