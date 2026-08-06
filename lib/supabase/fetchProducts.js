import { supabaseServer } from './serverClient'

// Shared getServerSideProps product fetch for the three product-facing pages.
// `desc:description` aliases the DB column back to `desc` so existing render
// code across index.js/catalogue.js/commande.js doesn't need to change.
export async function fetchProducts(ctx) {
  const supabase = supabaseServer(ctx)
  const { data } = await supabase
    .from('products')
    .select('id, name, emoji, photo, price, desc:description, techniques, popular')
    .order('sort_order')
  return data ?? []
}
