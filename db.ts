
import { createClient } from '@supabase/supabase-js';
import { Product, Category, NewsArticle, ComparisonPage, BudgetListPage } from './types';

// Standard environment variable access
// Fixed: Switched from import.meta.env to process.env as property 'env' does not exist on 'ImportMeta'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Singleton Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Data Transformers
 * Maps DB snake_case to Frontend camelCase
 */
const transformProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  slug: dbProduct.slug,
  name: dbProduct.name,
  brand: dbProduct.brand,
  category: dbProduct.category as Category,
  price: dbProduct.price,
  imageUrl: dbProduct.image_url, // Map image_url -> imageUrl
  description: dbProduct.description,
  specs: dbProduct.specs,
  dateAdded: dbProduct.date_added,
  affiliateUrl: dbProduct.affiliate_url, // New
  buyButtonText: dbProduct.buy_button_text, // New
});

const prepareProductForDb = (p: Product) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  price: p.price,
  image_url: p.imageUrl, // Map imageUrl -> image_url
  description: p.description,
  specs: p.specs,
  date_added: p.dateAdded,
  affiliate_url: p.affiliateUrl, // New
  buy_button_text: p.buyButtonText, // New
});

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from('products').select('*').order('date_added', { ascending: false });
      if (error) {
        console.error("Supabase Error:", error.message);
        return [];
      }
      return (data || []).map(transformProduct);
    },
    save: async (product: Product) => {
      const dbData = prepareProductForDb(product);
      const { error } = await supabase.from('products').upsert(dbData);
      if (error) throw error;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('products').delete().match({ id });
      if (error) throw error;
    }
  },

  comparisons: {
    getAll: async (): Promise<ComparisonPage[]> => {
      const { data, error } = await supabase.from('comparisons').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category as Category,
        productIds: c.product_ids,
        createdAt: c.created_at
      }));
    },
    save: async (comp: ComparisonPage) => {
      const { error } = await supabase.from('comparisons').upsert({
        id: comp.id,
        slug: comp.slug,
        title: comp.title,
        category: comp.category,
        product_ids: comp.productIds,
        created_at: comp.createdAt
      });
      if (error) throw error;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('comparisons').delete().match({ id });
      if (error) throw error;
    }
  },

  budgetLists: {
    getAll: async (): Promise<BudgetListPage[]> => {
      const { data, error } = await supabase.from('budget_lists').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(l => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        category: l.category as Category,
        budgetLabel: l.budget_label,
        maxPrice: l.max_price,
        productIds: l.product_ids,
        tags: l.tags,
        createdAt: l.created_at
      }));
    },
    save: async (list: BudgetListPage) => {
      const { error } = await supabase.from('budget_lists').upsert({
        id: list.id,
        slug: list.slug,
        title: list.title,
        category: list.category,
        budget_label: list.budgetLabel,
        max_price: list.maxPrice,
        product_ids: list.productIds,
        tags: list.tags,
        created_at: list.createdAt
      });
      if (error) throw error;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('budget_lists').delete().match({ id });
      if (error) throw error;
    }
  }
};

export const getNews = (): NewsArticle[] => {
  const stored = localStorage.getItem('at_news');
  return stored ? JSON.parse(stored) : [];
};

export const saveNews = (news: NewsArticle) => {
  const current = getNews();
  const updated = [...current.filter(n => n.id !== news.id), news];
  localStorage.setItem('at_news', JSON.stringify(updated));
};
