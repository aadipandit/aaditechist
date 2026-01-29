import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

// ✅ Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ✅ Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Products fetch error:', error);
        throw error;
      }

      return data ?? [];
    },

    save: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .upsert(product);

      if (error) {
        console.error('Product save error:', error);
        throw error;
      }
    },

    remove: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Product delete error:', error);
        throw error;
      }
    }
  },

  comparisons: {
    getAll: async (): Promise<ComparisonPage[]> => {
      const { data, error } = await supabase
        .from('comparisons')
        .select('*');

      if (error) throw error;
      return data ?? [];
    },

    save: async (comp: ComparisonPage) => {
      const { error } = await supabase
        .from('comparisons')
        .upsert(comp);

      if (error) throw error;
    }
  },

  budgetLists: {
    getAll: async (): Promise<BudgetListPage[]> => {
      const { data, error } = await supabase
        .from('budget_lists')
        .select('*');

      if (error) throw error;
      return data ?? [];
    },

    save: async (list: BudgetListPage) => {
      const { error } = await supabase
        .from('budget_lists')
        .upsert(list);

      if (error) throw error;
    }
  }
};

// News stays local
export const getNews = (): NewsArticle[] =>
  JSON.parse(localStorage.getItem('at_news') || '[]');

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  localStorage.setItem(
    'at_news',
    JSON.stringify([...current.filter(n => n.id !== news.id), news])
  );
};
