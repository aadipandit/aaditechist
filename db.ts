// db.ts
import { createClient } from '@supabase/supabase-js'

// ✅ Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// ✅ This is what Home.tsx expects as `api`
export const api = createClient(supabaseUrl, supabaseAnonKey)

// ==========================
// DATA HELPERS
// ==========================

// NEWS
export async function getNews() {
  const { data, error } = await api
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// PRODUCTS
export async function getProducts() {
  const { data, error } = await api
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// INSERT PRODUCT
export async function insertProduct(payload: any) {
  const { data, error } = await api
    .from('products')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

// COMPARISONS
export async function getComparisons() {
  const { data, error } = await api
    .from('comparisons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// BUDGET LISTS
export async function getBudgetLists() {
  const { data, error } = await api
    .from('budget_lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
