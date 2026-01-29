
import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

// Initialize Supabase Client (Assume keys in process.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

/**
 * Mock Data for when DB is not connected
 */
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: Category.SMARTPHONE,
    price: 134900,
    imageUrl: 'https://picsum.photos/seed/iphone15/400/300',
    description: 'The latest flagship from Apple with Titanium design and A17 Pro chip.',
    dateAdded: '2023-10-01',
    specs: [
      { key: 'brand', label: 'Brand', value: 'Apple' },
      { key: 'model-name', label: 'Model Name', value: 'iPhone 15 Pro' },
      { key: 'processor-chipset', label: 'Processor (Chipset)', value: 'A17 Pro' },
      { key: 'rear-camera-details', label: 'Rear Camera Details', value: '48MP + 12MP + 12MP' },
      { key: 'battery-capacity-mah', label: 'Battery Capacity (mAh)', value: '3274' }
    ]
  },
  {
    id: '2',
    slug: 'macbook-pro-m3',
    name: 'MacBook Pro M3',
    brand: 'Apple',
    category: Category.LAPTOP,
    price: 169900,
    imageUrl: 'https://picsum.photos/seed/mbp/400/300',
    description: 'Powerful performance with the new M3 chip.',
    dateAdded: '2023-11-01',
    specs: [
      { key: 'brand', label: 'Brand', value: 'Apple' },
      { key: 'processor', label: 'Processor', value: 'M3' },
      { key: 'ram-size-type', label: 'RAM Size & Type', value: '8GB' },
      { key: 'storage-capacity', label: 'Storage Capacity', value: '512GB' }
    ]
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback Mock Logic (using localStorage but with async API)
const mockStorage = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val))
};

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        return data || [];
      }
      await delay(300);
      const stored = mockStorage.get('at_products');
      return stored || INITIAL_PRODUCTS;
    },
  save: async (product: Product) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product)
      .select();

    console.log('PRODUCT SENT:', product);
    console.log('SUPABASE RESPONSE:', data);
    console.log('SUPABASE ERROR:', error);

    if (error) {
      alert('Supabase error: ' + error.message);
      throw error;
    }

    return;
  }

  // fallback
  await delay(500);
  const products = await api.products.getAll();
  const updated = [...products.filter(p => p.id !== product.id), product];
  mockStorage.set('at_products', updated);
}

    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('products').delete().match({ id });
        if (error) throw error;
        return;
      }
      await delay(300);
      const products = await api.products.getAll();
      const updated = products.filter(p => p.id !== id);
      mockStorage.set('at_products', updated);
    }
  },

  comparisons: {
    getAll: async (): Promise<ComparisonPage[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('comparisons').select('*');
        if (error) throw error;
        return data || [];
      }
      await delay(300);
      return mockStorage.get('at_comparisons') || [];
    },
    save: async (comp: ComparisonPage) => {
      if (supabase) {
        const { error } = await supabase.from('comparisons').upsert(comp);
        if (error) throw error;
        return;
      }
      await delay(500);
      const comps = await api.comparisons.getAll();
      const updated = [...comps.filter(c => c.id !== comp.id), comp];
      mockStorage.set('at_comparisons', updated);
    },
    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('comparisons').delete().match({ id });
        if (error) throw error;
        return;
      }
      await delay(300);
      const comps = await api.comparisons.getAll();
      const updated = comps.filter(c => c.id !== id);
      mockStorage.set('at_comparisons', updated);
    }
  },

  budgetLists: {
    getAll: async (): Promise<BudgetListPage[]> => {
      if (supabase) {
        const { data, error } = await supabase.from('budget_lists').select('*');
        if (error) throw error;
        return data || [];
      }
      await delay(300);
      return mockStorage.get('at_budget_lists') || [];
    },
    save: async (list: BudgetListPage) => {
      if (supabase) {
        const { error } = await supabase.from('budget_lists').upsert(list);
        if (error) throw error;
        return;
      }
      await delay(500);
      const lists = await api.budgetLists.getAll();
      const updated = [...lists.filter(l => l.id !== list.id), list];
      mockStorage.set('at_budget_lists', updated);
    },
    delete: async (id: string) => {
      if (supabase) {
        const { error } = await supabase.from('budget_lists').delete().match({ id });
        if (error) throw error;
        return;
      }
      await delay(300);
      const lists = await api.budgetLists.getAll();
      const updated = lists.filter(l => l.id !== id);
      mockStorage.set('at_budget_lists', updated);
    }
  }
};

// Original News functions as requested (keeping legacy structure but can be easily converted)
export const getNews = (): NewsArticle[] => {
  const stored = localStorage.getItem('at_news');
  return stored ? JSON.parse(stored) : [];
};

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  const updated = [...current.filter(n => n.id !== news.id), news];
  localStorage.setItem('at_news', JSON.stringify(updated));
};

/**
 * Smart Ranking Logic
 */
export const rankProducts = (products: Product[], category: Category) => {
  return products.map(p => {
    let score = 0;
    p.specs.forEach(s => {
      const val = parseFloat(s.value);
      if (isNaN(val)) return;

      if (category === Category.SMARTPHONE) {
        if (s.key.includes('ram')) score += val * 10;
        if (s.key.includes('battery')) score += val / 100;
        if (s.key.includes('camera')) score += val;
      } else if (category === Category.LAPTOP) {
        if (s.key.includes('ram')) score += val * 20;
        if (s.key.includes('storage')) score += val / 10;
        if (s.key.includes('battery')) score += val * 5;
      }
    });
    const vfm = score / (p.price / 1000);
    return { product: p, score: vfm };
  }).sort((a, b) => b.score - a.score);
};

// Legacy exports for backward compatibility during transition
export const getProducts = api.products.getAll;
export const saveProduct = api.products.save;
export const deleteProduct = api.products.delete;
export const getComparisons = api.comparisons.getAll;
export const saveComparison = api.comparisons.save;
export const deleteComparison = api.comparisons.delete;
export const getBudgetLists = api.budgetLists.getAll;
export const saveBudgetList = api.budgetLists.save;
export const deleteBudgetList = api.budgetLists.delete;
