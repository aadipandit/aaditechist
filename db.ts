// db.ts
import { createClient } from '@supabase/supabase-js'

// -----------------------------
// Environment variables (Vite)
// -----------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Supabase environment variables are missing')
}

// -----------------------------
// Supabase client (internal)
// -----------------------------
const supabase = createClient(supabaseUrl, supabaseKey)

// -----------------------------
// API LAYER (what your app uses)
// -----------------------------
export const api = {
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    async save(product: any) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  comparisons: {
    async getAll() {
      const { data, error } = await supabase
        .from('comparisons')
        .select('*')

      if (error) throw error
      return data
    }
  },

  budgetLists: {
    async getAll() {
      const { data, error } = await supabase
        .from('budget_lists')
        .select('*')

      if (error) throw error
      return data
    }
  },

  news: {
    async getAll() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  }
}

// Optional direct helpers (if used elsewhere)
export async function getNews() {
  return api.news.getAll()
}
