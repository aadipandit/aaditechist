
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

export type BudgetRange = 'Under 10k' | 'Under 20k' | 'Under 50k' | 'Above 50k';

export const BUDGET_LIMITS = {
  'Under 10k': 10000,
  'Under 20k': 20000,
  'Under 50k': 50000,
  'Above 50k': Infinity
};

export const CATEGORY_TEMPLATES: Record<Category, string[]> = {
  [Category.SMARTPHONE]: [
    "Brand", "Model Name", "Launch Date", "Price (MRP & Best Price)", "Availability", "Screen Size", "Display Type", "Resolution", "Refresh Rate", "Protection", "Processor (Chipset)", "CPU", "GPU", "RAM Options", "Storage Options", "Expandable Storage (Yes/No)", "Rear Camera Details", "Front Camera", "Video Recording", "Battery Capacity (mAh)", "Charging Speed (W)", "Charging Type", "Wireless Charging (Yes/No)", "Operating System", "UI Version", "Update Policy", "5G / 4G Support", "Wi-Fi Version", "Bluetooth Version", "NFC", "Fingerprint Sensor Type", "Face Unlock", "Water / Dust Rating", "Weight", "Available Colors"
  ],
  [Category.LAPTOP]: [
    "Brand", "Model Name", "Price", "Launch Year", "Best For (Student / Gaming / Office)", "Screen Size", "Resolution", "Display Panel Type", "Refresh Rate", "Brightness (nits)", "Processor", "Generation", "GPU Type", "GPU Model", "RAM Size & Type", "Expandable RAM (Yes/No)", "Storage Type", "Storage Capacity", "Battery Capacity (Wh)", "Battery Backup (hours)", "Charger Wattage", "Operating System", "Weight", "Build Material", "Wi-Fi Version", "Bluetooth Version", "Ports (USB, HDMI, Type-C)"
  ],
  [Category.TABLET]: [
    "Brand", "Model Name", "Price", "Launch Year", "Screen Size", "Resolution", "Display Type", "Refresh Rate", "Processor", "GPU", "RAM", "Storage", "Expandable Storage (Yes/No)", "Rear Camera", "Front Camera", "Battery Capacity", "Charging Speed", "Charging Type", "Operating System", "Stylus Support (Yes/No)", "Wi-Fi", "Cellular Support (Yes/No)", "Bluetooth Version"
  ],
  [Category.EARPHONES]: [
    "Brand", "Model Name", "Price", "Type (TWS / Wired / Neckband)", "Driver Size", "Sound Signature", "Codec Support", "Active Noise Cancellation (Yes/No)", "Transparency Mode (Yes/No)", "Gaming Mode (Yes/No)", "Touch Controls", "Earbud Battery", "Case Battery", "Total Playback Time", "Fast Charging (Yes/No)", "Bluetooth Version", "Range", "Water Resistance Rating", "Weight", "Available Colors"
  ],
  [Category.SMARTWATCH]: [
    "Brand", "Model Name", "Price", "Compatible OS", "Screen Size", "Display Type", "Always-On Display (Yes/No)", "Heart Rate Monitoring", "SpO2 Monitoring", "Sleep Tracking", "Step Counter", "Sports Modes", "Battery Life (days)", "Charging Type", "Bluetooth Version", "Calling Support (Yes/No)", "GPS (Yes/No)", "Water Resistance Rating", "Strap Material", "Weight"
  ],
  [Category.CHARGER]: [
    "Brand", "Model Name", "Price", "Output Power (W)", "Charging Type", "Supported Protocols (PD, QC, PPS)", "Port Type (USB-A / USB-C)", "Number of Ports", "Supported Devices", "Cable Included (Yes/No)", "Cable Length", "Safety Certifications"
  ]
};

export const CATEGORY_KEY_SPECS: Record<Category, string[]> = {
  [Category.SMARTPHONE]: ["Processor (Chipset)", "RAM Options", "Rear Camera Details", "Battery Capacity (mAh)", "Display Type", "Refresh Rate"],
  [Category.LAPTOP]: ["Processor", "RAM Size & Type", "Storage Capacity", "GPU Model", "Screen Size", "Battery Backup (hours)"],
  [Category.TABLET]: ["Processor", "RAM", "Display Type", "Battery Capacity", "Screen Size"],
  [Category.EARPHONES]: ["Type (TWS / Wired / Neckband)", "Active Noise Cancellation (Yes/No)", "Total Playback Time", "Driver Size"],
  [Category.SMARTWATCH]: ["Display Type", "Battery Life (days)", "Calling Support (Yes/No)", "GPS (Yes/No)"],
  [Category.CHARGER]: ["Output Power (W)", "Charging Type", "Port Type (USB-A / USB-C)", "Number of Ports"]
};
