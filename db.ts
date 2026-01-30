// db.ts
import { createClient } from '@supabase/supabase-js'

// ✅ Vite-safe environment variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

// ❗ Hard safety check (prevents crash)
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables missing')
  throw new Error('Supabase is not configured correctly')
}

// ✅ SINGLE shared client
export const api = createClient(supabaseUrl, supabaseKey)

/* ----------------------------
   Example helper functions
-----------------------------*/

export async function getNews() {
  const { data, error } = await api
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function insertProduct(product: any) {
  const { data, error } = await api
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data
}
