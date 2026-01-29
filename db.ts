import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

// ✅ Correct Vite env usage
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// ✅ Create client only if keys exist
export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// Delay helper
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Local fallback
const mockStorage = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key: string, val: any) =>
    localStorage.setItem(key, JSON.stringify(val)),
};

export const api = {
  products: {
    async getAll(): Promise<Product[]> {
      if (!supabase) return mockStorage.get('at_products') || [];
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data || [];
    },

    async save(product: Product) {
      if (!supabase) {
        const items = await this.getAll();
        mockStorage.set(
          'at_products',
          [...items.filter(p => p.id !== product.id), product]
        );
        return;
      }

      const { error } = await supabase.from('products').upsert(product);
      if (error) throw error;
    },

    async remove(id: string) {
      if (!supabase) {
        const items = await this.getAll();
        mockStorage.set(
          'at_products',
          items.filter(p => p.id !== id)
        );
        return;
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
  },

  comparisons: {
    async getAll(): Promise<ComparisonPage[]> {
      if (!supabase) return mockStorage.get('at_comparisons') || [];
      const { data, error } = await supabase.from('comparisons').select('*');
      if (error) throw error;
      return data || [];
    },

    async save(item: ComparisonPage) {
      if (!supabase) {
        const items = await this.getAll();
        mockStorage.set(
          'at_comparisons',
          [...items.filter(i => i.id !== item.id), item]
        );
        return;
      }

      const { error } = await supabase.from('comparisons').upsert(item);
      if (error) throw error;
    },

    async remove(id: string) {
      if (!supabase) return;
      const { error } = await supabase.from('comparisons').delete().eq('id', id);
      if (error) throw error;
    },
  },

  budgetLists: {
    async getAll(): Promise<BudgetListPage[]> {
      if (!supabase) return mockStorage.get('at_budget_lists') || [];
      const { data, error } = await supabase.from('budget_lists').select('*');
      if (error) throw error;
      return data || [];
    },

    async save(item: BudgetListPage) {
      if (!supabase) {
        const items = await this.getAll();
        mockStorage.set(
          'at_budget_lists',
          [...items.filter(i => i.id !== item.id), item]
        );
        return;
      }

      const { error } = await supabase.from('budget_lists').upsert(item);
      if (error) throw error;
    },

    async remove(id: string) {
      if (!supabase) return;
      const { error } = await supabase.from('budget_lists').delete().eq('id', id);
      if (error) throw error;
    },
  },
};
