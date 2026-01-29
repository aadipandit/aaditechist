import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

// ================= SUPABASE INIT =================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// ================= MOCK DATA =================
const INITIAL_PRODUCTS: Product[] = [];

// ================= HELPERS =================
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockStorage = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val))
};

// ================= API =================
export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error('GET PRODUCTS ERROR:', error);
          return [];
        }
        return data || [];
      }

      await delay(300);
      return mockStorage.get('at_products') || INITIAL_PRODUCTS;
    },

    save: async (product: Product) => {
      if (supabase) {
        const payload = {
          id: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          image_url: product.imageUrl,
          description: product.description,
          date_added: product.dateAdded,
          specs: product.specs // JSONB
        };

        const { data, error } = await supabase
          .from('products')
          .upsert(payload)
          .select();

        if (error) {
          console.error('SAVE PRODUCT ERROR:', error);
          alert(`Supabase error: ${error.message}`);
          return;
        }

        console.log('PRODUCT SAVED:', data);
        return;
      }

      // fallback
      await delay(300);
      const products = await api.products.getAll();
      mockStorage.set(
        'at_products',
        [...products.filter(p => p.id !== product.id), product]
      );
    },

    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          console.error('DELETE PRODUCT ERROR:', error);
          alert(error.message);
        }
        return;
      }

      await delay(300);
      const products = await api.products.getAll();
      mockStorage.set(
        'at_products',
        products.filter(p => p.id !== id)
      );
    }
  },

  comparisons: {
    getAll: async (): Promise<ComparisonPage[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('comparisons').select('*');
        if (error) {
          console.error(error);
          return [];
        }
        return data || [];
      }
      return mockStorage.get('at_comparisons') || [];
    },

    save: async (comp: ComparisonPage) => {
      if (supabase) {
        const { error } = await supabase.from('comparisons').upsert(comp);
        if (error) alert(error.message);
        return;
      }
      const items = await api.comparisons.getAll();
      mockStorage.set(
        'at_comparisons',
        [...items.filter(i => i.id !== comp.id), comp]
      );
    },

    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('comparisons').delete().eq('id', id);
        if (error) alert(error.message);
        return;
      }
      const items = await api.comparisons.getAll();
      mockStorage.set(
        'at_comparisons',
        items.filter(i => i.id !== id)
      );
    }
  },

  budgetLists: {
    getAll: async (): Promise<BudgetListPage[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('budget_lists').select('*');
        if (error) {
          console.error(error);
          return [];
        }
        return data || [];
      }
      return mockStorage.get('at_budget_lists') || [];
    },

    save: async (list: BudgetListPage) => {
      if (supabase) {
        const { error } = await supabase.from('budget_lists').upsert(list);
        if (error) alert(error.message);
        return;
      }
      const items = await api.budgetLists.getAll();
      mockStorage.set(
        'at_budget_lists',
        [...items.filter(i => i.id !== list.id), list]
      );
    },

    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('budget_lists').delete().eq('id', id);
        if (error) alert(error.message);
        return;
      }
      const items = await api.budgetLists.getAll();
      mockStorage.set(
        'at_budget_lists',
        items.filter(i => i.id !== id)
      );
    }
  }
};

// ================= NEWS (LOCAL) =================
export const getNews = (): NewsArticle[] =>
  JSON.parse(localStorage.getItem('at_news') || '[]');

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  localStorage.setItem(
    'at_news',
    JSON.stringify([...current.filter(n => n.id !== news.id), news])
  );
};

// ================= RANKING =================
export const rankProducts = (products: Product[], category: Category) =>
  products
    .map(p => {
      let score = 0;
      p.specs.forEach(s => {
        const v = Number(s.value);
        if (!isNaN(v)) {
          if (category === Category.SMARTPHONE) score += v;
          if (category === Category.LAPTOP) score += v * 1.5;
        }
      });
      return { product: p, score: score / (p.price || 1) };
    })
    .sort((a, b) => b.score - a.score);

// ================= LEGACY EXPORTS =================
export const getProducts = api.products.getAll;
export const saveProduct = api.products.save;
export const deleteProduct = api.products.delete;
export const getComparisons = api.comparisons.getAll;
export const saveComparison = api.comparisons.save;
export const deleteComparison = api.comparisons.delete;
export const getBudgetLists = api.budgetLists.getAll;
export const saveBudgetList = api.budgetLists.save;
export const deleteBudgetList = api.budgetLists.delete;

