import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

/* =========================
   SUPABASE INITIALIZATION
   ========================= */

// ✅ Vite frontend must use VITE_ prefixed vars
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Safety check
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Supabase env vars missing');
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* =========================
   API LAYER
   ========================= */

export const api = {
  products: {
    async getAll(): Promise<Product[]> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async save(product: Product) {
      const { error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'id' });

      if (error) throw error;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  comparisons: {
    async getAll(): Promise<ComparisonPage[]> {
      const { data, error } = await supabase
        .from('comparisons')
        .select('*');

      if (error) throw error;
      return data || [];
    },

    async save(comp: ComparisonPage) {
      const { error } = await supabase
        .from('comparisons')
        .upsert(comp, { onConflict: 'id' });

      if (error) throw error;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('comparisons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  budgetLists: {
    async getAll(): Promise<BudgetListPage[]> {
      const { data, error } = await supabase
        .from('budget_lists')
        .select('*');

      if (error) throw error;
      return data || [];
    },

    async save(list: BudgetListPage) {
      const { error } = await supabase
        .from('budget_lists')
        .upsert(list, { onConflict: 'id' });

      if (error) throw error;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('budget_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  }
};

/* =========================
   NEWS (LOCAL ONLY)
   ========================= */

export const getNews = (): NewsArticle[] => {
  const stored = localStorage.getItem('at_news');
  return stored ? JSON.parse(stored) : [];
};

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  const updated = [...current.filter(n => n.id !== news.id), news];
  localStorage.setItem('at_news', JSON.stringify(updated));
};
