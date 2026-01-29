import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* -------------------------------- PRODUCTS -------------------------------- */

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data ?? [];
    },

    save: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .upsert(product);

      if (error) throw error;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

/* ------------------------------- COMPARISONS ------------------------------- */

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
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('comparisons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },

/* ------------------------------- BUDGET LISTS ------------------------------- */

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
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('budget_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
  },
};

/* --------------------------------- NEWS ---------------------------------- */

export const getNews = (): NewsArticle[] => {
  const stored = localStorage.getItem('at_news');
  return stored ? JSON.parse(stored) : [];
};

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  localStorage.setItem(
    'at_news',
    JSON.stringify([...current.filter(n => n.id !== news.id), news])
  );
};
