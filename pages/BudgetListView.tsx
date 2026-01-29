
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../db';
import { BudgetListPage, Product, CATEGORY_KEY_SPECS } from '../types';
import { ArrowLeft, IndianRupee, Zap, Info, Loader2 } from 'lucide-react';

const BudgetListView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [list, setList] = useState<BudgetListPage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lists = await api.budgetLists.getAll();
        const found = lists.find(l => l.slug === slug);
        if (found) {
          setList(found);
          const allProds = await api.products.getAll();
          setProducts(found.productIds.map(id => allProds.find(p => p.id === id)).filter(Boolean) as Product[]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;
  if (!list) return <div className="py-20 text-center">List not found.</div>;

  const keySpecLabels = CATEGORY_KEY_SPECS[list.category] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-bold mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </Link>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{list.title}</h1>
        <p className="text-xl text-slate-500">Shared rankings for {list.budgetLabel}</p>
      </div>

      <div className="space-y-8">
        {products.map((p, idx) => (
          <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-lg transition-all hover:shadow-2xl">
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-600 text-white flex items-center justify-center rounded-2xl font-black text-2xl mb-4">#{idx + 1}</div>
                <img src={p.imageUrl} className="w-40 h-40 object-contain" alt={p.name} />
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <div className="text-primary-600 font-extrabold text-xl flex items-center">
                      <IndianRupee className="w-5 h-5 mr-0.5" />
                      {p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  {list.tags[p.id] && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> {list.tags[p.id]}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</p>
                
                <div className="grid grid-cols-2 gap-3 py-4">
                  {keySpecLabels.map(label => {
                    const spec = p.specs.find(s => s.label === label);
                    return spec ? (
                      <div key={label} className="flex items-center space-x-2">
                        <Info className="w-3 h-3 text-primary-400 shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          <strong className="text-slate-700 dark:text-slate-200">{label}:</strong> {spec.value}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {expandedId === p.id ? 'Hide Specs' : 'View Full Specs'}
                  </button>
                  <Link to={`/product/${p.slug}`} className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                    Product Page
                  </Link>
                </div>

                {expandedId === p.id && (
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {p.specs.map(s => (
                      <div key={s.key} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{s.label}</span>
                        <span className="text-sm font-bold">{s.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetListView;
