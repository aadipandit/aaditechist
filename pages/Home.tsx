
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getNews } from '../db';
import { Product, NewsArticle, Category, ComparisonPage, BudgetListPage } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Zap, Laptop, Tablet, Headphones, Watch, BatteryCharging, ArrowRightLeft, Sparkles, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonPage[]>([]);
  const [budgetLists, setBudgetLists] = useState<BudgetListPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, c, b] = await Promise.all([
          api.products.getAll(),
          api.comparisons.getAll(),
          api.budgetLists.getAll()
        ]);
        setProducts(p);
        setComparisons(c);
        setBudgetLists(b);
        setNews(getNews());
      } catch (err) {
        console.error("Failed to load backend data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCompare = (id: string) => {
    setSelectedForCompare(prev => {
        if (prev.includes(id)) return prev.filter(item => item !== id);
        if (prev.length >= 4) return prev;
        return [...prev, id];
    });
  };

  const startComparison = () => {
    if (selectedForCompare.length >= 2) navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  const categories = [
    { name: Category.SMARTPHONE, icon: <Zap className="w-6 h-6" />, count: products.filter(p => p.category === Category.SMARTPHONE).length },
    { name: Category.LAPTOP, icon: <Laptop className="w-6 h-6" />, count: products.filter(p => p.category === Category.LAPTOP).length },
    { name: Category.TABLET, icon: <Tablet className="w-6 h-6" />, count: products.filter(p => p.category === Category.TABLET).length },
    { name: Category.EARPHONES, icon: <Headphones className="w-6 h-6" />, count: products.filter(p => p.category === Category.EARPHONES).length },
    { name: Category.SMARTWATCH, icon: <Watch className="w-6 h-6" />, count: products.filter(p => p.category === Category.SMARTWATCH).length },
    { name: Category.CHARGER, icon: <BatteryCharging className="w-6 h-6" />, count: products.filter(p => p.category === Category.CHARGER).length },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Connecting to Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white py-24 px-8 md:px-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary-600/20 border border-primary-500/30 px-6 py-2 rounded-full text-xs font-bold mb-8">
             <Sparkles className="w-4 h-4 text-primary-400" />
             <span className="uppercase tracking-widest text-primary-400">Database Persistent Engine</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Compare The <br />Best. <span className="text-primary-500">Smarter.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
            Automated expert rankings, side-by-side spec sheets, and shared technical comparisons.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/category/all" className="bg-primary-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary-500 transition-all hover:scale-105">
              Explore All Gadgets
            </Link>
            <Link to="/admin" className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all">
              Admin Login
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary-600/10 to-transparent pointer-events-none" />
      </section>

      {/* Featured Comparisons */}
      {comparisons.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tight">Top Battles</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Professional Comparisons</p>
            </div>
            <Link to="/compare" className="text-primary-600 font-bold flex items-center group">
              Custom Compare <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.slice(0, 3).map(c => (
              <Link key={c.id} to={`/v/${c.slug}`} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 hover:border-primary-500 transition-all group shadow-sm hover:shadow-xl">
                 <div className="flex -space-x-4 mb-6">
                    {c.productIds.slice(0, 3).map(id => {
                      const p = products.find(prod => prod.id === id);
                      return <img key={id} src={p?.imageUrl} className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 object-contain shadow-md" />;
                    })}
                 </div>
                 <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{c.title}</h3>
                 <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>{c.category}</span>
                    <span className="mx-2">•</span>
                    <span>{c.productIds.length} Devices</span>
                 </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Budget Expert Picks */}
      {budgetLists.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 -mx-4 px-4 py-20 md:rounded-[4rem]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black tracking-tighter mb-4">Expert Budget Picks</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Ranked lists compiled by our automated smart-ranking engine.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {budgetLists.slice(0, 4).map(l => (
                <Link key={l.id} to={`/best/${l.slug}`} className="relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all group overflow-hidden">
                   <div className="relative z-10">
                     <span className="bg-primary-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">{l.budgetLabel}</span>
                     <h3 className="text-3xl font-bold mb-4 group-hover:text-primary-600 transition-colors">{l.title}</h3>
                     <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                          {l.productIds.slice(0, 3).map(id => (
                            <div key={id} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900" />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-slate-400">Top {l.productIds.length} Items</span>
                     </div>
                   </div>
                   <ArrowRightLeft className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-100 dark:text-slate-800 rotate-12 transition-transform group-hover:rotate-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Tech Drop */}
      <section>
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-4xl font-black tracking-tight">Recent Gadgets</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">New additions to cloud database</p>
            </div>
            {selectedForCompare.length > 0 && (
                <button 
                    onClick={startComparison}
                    className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold animate-bounce shadow-xl shadow-primary-500/20"
                >
                    Compare {selectedForCompare.length} items
                </button>
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onCompare={handleCompare}
                isCompareMode={selectedForCompare.includes(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
