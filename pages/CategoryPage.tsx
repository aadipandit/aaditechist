
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../db';
import { Product, Category, BUDGET_LIMITS, BudgetListPage } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, SlidersHorizontal, ArrowRight, Loader2 } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [budgetLists, setBudgetLists] = useState<BudgetListPage[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeBudget, setActiveBudget] = useState<string | null>(searchParams.get('budget'));
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [loading, setLoading] = useState(true);

  // Fixed: api.products.getAll and api.budgetLists.getAll are async
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [all, allBudgetLists] = await Promise.all([
          api.products.getAll(),
          api.budgetLists.getAll()
        ]);
        
        const query = searchParams.get('q')?.toLowerCase();
        
        let filtered = all;
        if (name && name !== 'all') {
          filtered = filtered.filter(p => p.category === name);
        }
        
        if (query) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
          );
        }

        setProducts(filtered);
        setBudgetLists(allBudgetLists.filter(l => l.category === name || name === 'all'));
        applyFilters(filtered, activeBudget, sortBy);
      } catch (error) {
        console.error("Error loading category data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [name, searchParams]);

  const applyFilters = (baseProducts: Product[], budget: string | null, sort: string) => {
    let result = [...baseProducts];
    
    if (budget) {
      const limit = BUDGET_LIMITS[budget as keyof typeof BUDGET_LIMITS];
      if (budget === 'Above 50k') {
        result = result.filter(p => p.price >= 50000);
      } else {
        result = result.filter(p => p.price <= limit);
      }
    }

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'newest') result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

    setFilteredProducts(result);
  };

  const handleBudgetChange = (budget: string | null) => {
    setActiveBudget(budget);
    applyFilters(products, budget, sortBy);
  };

  const handleSortChange = (sort: 'newest' | 'price-low' | 'price-high') => {
    setSortBy(sort);
    applyFilters(products, activeBudget, sort);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold">Exploring gadgets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter capitalize leading-none">{name === 'all' ? 'All Gadgets' : name}</h1>
          <p className="text-slate-500 mt-2 font-medium">{filteredProducts.length} items found in this section</p>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="relative inline-block">
                <select 
                    className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 pr-12 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as any)}
                >
                    <option value="newest">Latest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 w-5 h-5 pointer-events-none text-slate-400" />
            </div>
        </div>
      </div>

      {budgetLists.length > 0 && (
        <section className="bg-primary-600/5 dark:bg-primary-900/10 border border-primary-500/20 rounded-[3rem] p-8 md:p-12">
          <div className="flex items-center space-x-2 mb-8">
            <span className="w-10 h-1 bg-primary-600 rounded-full"></span>
            <h2 className="text-2xl font-black tracking-tight">Expert Budget Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetLists.map(list => (
              <Link key={list.id} to={`/best/${list.slug}`} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 hover:shadow-xl transition-all group">
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full mb-3 inline-block">
                  {list.budgetLabel}
                </span>
                <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors flex items-center justify-between">
                  {list.title} <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center space-x-2 mb-8 font-black text-xl">
              <SlidersHorizontal className="w-6 h-6 text-primary-500" />
              <span>Filters</span>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 mb-6">Budget Range</h4>
                <div className="space-y-4">
                  {[null, 'Under 10k', 'Under 20k', 'Under 50k', 'Above 50k'].map((b) => (
                    <label key={b || 'all'} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="budget" 
                          className="peer appearance-none w-6 h-6 border-2 border-slate-200 dark:border-slate-700 rounded-full checked:border-primary-600 transition-all cursor-pointer"
                          checked={activeBudget === b}
                          onChange={() => handleBudgetChange(b)}
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary-600 rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                      </div>
                      <span className={`text-sm font-bold tracking-tight transition-colors ${activeBudget === b ? 'text-primary-600' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900'}`}>
                        {b || 'Any Price'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-dashed border-slate-300 dark:border-slate-700">
                <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
                    <Filter className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-2">Zero gadgets found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Try adjusting your filters or check a different category.</p>
                <button 
                  onClick={() => {setActiveBudget(null); applyFilters(products, null, sortBy);}}
                  className="mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
                >
                    Reset Filters
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
