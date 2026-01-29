import { createClient } from '@supabase/supabase-js'
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types'

// ✅ Vite env variables (browser-safe)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// ✅ Create client ONLY if keys exist
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ---------------- PRODUCTS ----------------
export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      if (!supabase) throw new Error('Supabase not configured')

      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error
      return data ?? []
    },

    save: async (product: Product) => {
      if (!supabase) throw new Error('Supabase not configured')

      const { error } = await supabase
        .from('products')
        .upsert(product)

      if (error) throw error
    },

    remove: async (id: string) => {
      if (!supabase) throw new Error('Supabase not configured')

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  comparisons: {
    getAll: async (): Promise<ComparisonPage[]> => {
      const { data, error } = await supabase!
        .from('comparisons')
        .select('*')

      if (error) throw error
      return data ?? []
    },

    save: async (comp: ComparisonPage) => {
      const { error } = await supabase!
        .from('comparisons')
        .upsert(comp)

      if (error) throw error
    }
  },

  budgetLists: {
    getAll: async (): Promise<BudgetListPage[]> => {
      const { data, error } = await supabase!
        .from('budget_lists')
        .select('*')

      if (error) throw error
      return data ?? []
    },

    save: async (list: BudgetListPage) => {
      const { error } = await supabase!
        .from('budget_lists')
        .upsert(list)

      if (error) throw error
    }
  }
}

// ---------------- NEWS (local only) ----------------
export const getNews = (): NewsArticle[] =>
  JSON.parse(localStorage.getItem('at_news') || '[]')

export const saveNews = (news: NewsArticle) => {
  const current = getNews()
  localStorage.setItem(
    'at_news',
    JSON.stringify([...current.filter(n => n.id !== news.id), news])
  )
}
