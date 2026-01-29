import { createClient } from '@supabase/supabase-js'
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types'

// ✅ Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase env vars missing')
}

// ✅ Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

/* ---------------- PRODUCTS ---------------- */

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) throw error
  return data || []
}

export const saveProduct = async (product: Product) => {
  const { error } = await supabase
    .from('products')
    .upsert(product)

  if (error) throw error
}

export const removeProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* ---------------- COMPARISONS ---------------- */

export const getComparisons = async (): Promise<ComparisonPage[]> => {
  const { data, error } = await supabase
    .from('comparisons')
    .select('*')

  if (error) throw error
  return data || []
}

export const saveComparison = async (comp: ComparisonPage) => {
  const { error } = await supabase
    .from('comparisons')
    .upsert(comp)

  if (error) throw error
}

export const removeComparison = async (id: string) => {
  const { error } = await supabase
    .from('comparisons')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* ---------------- BUDGET LISTS ---------------- */

export const getBudgetLists = async (): Promise<BudgetListPage[]> => {
  const { data, error } = await supabase
    .from('budget_lists')
    .select('*')

  if (error) throw error
  return data || []
}

export const saveBudgetList = async (list: BudgetListPage) => {
  const { error } = await supabase
    .from('budget_lists')
    .upsert(list)

  if (error) throw error
}

export const removeBudgetList = async (id: string) => {
  const { error } = await supabase
    .from('budget_lists')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/* ---------------- NEWS (local only) ---------------- */

export const getNews = (): NewsArticle[] => {
  const stored = localStorage.getItem('at_news')
  return stored ? JSON.parse(stored) : []
}

export const saveNews = (news: NewsArticle) => {
  const current = getNews()
  const updated = [...current.filter(n => n.id !== news.id), news]
  localStorage.setItem('at_news', JSON.stringify(updated))
}
