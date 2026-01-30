
export enum Category {
  SMARTPHONE = 'Smartphone',
  LAPTOP = 'Laptop',
  TABLET = 'Tablet',
  EARPHONES = 'Earphones/TWS',
  SMARTWATCH = 'Smartwatch',
  CHARGER = 'Chargers/Cables'
}

export interface Spec {
  label: string;
  value: string;
  key: string;
  isHighlightable?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  imageUrl: string;
  description: string;
  specs: Spec[];
  dateAdded: string;
  affiliateUrl?: string; // New: Affiliate Link
  buyButtonText?: string; // New: Custom Button Text (e.g. "Buy on Amazon")
}

export interface ComparisonPage {
  id: string;
  slug: string;
  title: string;
  category: Category;
  productIds: string[];
  createdAt: string;
}

export interface BudgetListPage {
  id: string;
  slug: string;
  title: string;
  category: Category;
  budgetLabel: string;
  maxPrice: number;
  productIds: string[];
  tags: Record<string, string>; // productId -> tag (Best Camera, etc.)
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
}

export const BUDGET_LIMITS = {
  'Under 10k': 10000,
  'Under 20k': 20000,
  'Under 50k': 50000,
  'Above 50k': Infinity
};

export const CATEGORY_TEMPLATES: Record<Category, string[]> = {
  [Category.SMARTPHONE]: [
    "Brand", "Model Name", "Launch Date", "Price", "Processor", "RAM", "Storage", "Rear Camera", "Front Camera", "Battery", "Display"
  ],
  [Category.LAPTOP]: [
    "Brand", "Model Name", "Price", "Processor", "RAM", "Storage", "GPU", "Display Size", "Battery Backup"
  ],
  [Category.TABLET]: ["Brand", "Model Name", "Price", "Processor", "RAM", "Storage", "Display"],
  [Category.EARPHONES]: ["Brand", "Model Name", "Price", "ANC", "Battery Life"],
  [Category.SMARTWATCH]: ["Brand", "Model Name", "Price", "Display", "Battery Life"],
  [Category.CHARGER]: ["Brand", "Model Name", "Price", "Watts", "Ports"]
};

export const CATEGORY_KEY_SPECS: Record<Category, string[]> = {
  [Category.SMARTPHONE]: ["Processor", "RAM", "Rear Camera", "Battery"],
  [Category.LAPTOP]: ["Processor", "RAM", "Storage", "GPU"],
  [Category.TABLET]: ["Processor", "RAM", "Display"],
  [Category.EARPHONES]: ["ANC", "Battery Life"],
  [Category.SMARTWATCH]: ["Display", "Battery Life"],
  [Category.CHARGER]: ["Watts", "Ports"]
};
