
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../db';
import { Product, Spec } from '../types';
import { IndianRupee, ArrowLeft, Plus, X, Search, CheckCircle2, Loader2 } from 'lucide-react';

const Comparison: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  // Fixed: api.products.getAll is async, so we must await it inside useEffect
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const all = await api.products.getAll();
        setAllProducts(all);
        const selected = ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Product[];
        setProducts(selected);
      } catch (error) {
        console.error("Failed to load products for comparison", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  const removeProduct = (id: string) => {
    const newIds = ids.filter(i => i !== id);
    setSearchParams({ ids: newIds.join(',') });
  };

  const addProduct = (id: string) => {
    if (ids.length >= 4) return;
    if (ids.includes(id)) return;
    setSearchParams({ ids: [...ids, id].join(',') });
    setIsSearchOpen(false);
  };

  // Get unique spec labels across all products
  const allSpecLabels = Array.from(new Set(products.flatMap(p => p.specs.map(s => s.label))));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold">Loading Comparison...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 overflow-x-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold">Compare Gadgets</h1>
        <div className="text-sm text-slate-500">{products.length} of 4 items selected</div>
      </div>

      <div className="min-w-[800px]">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-1/5 py-4 px-2 text-left bg-transparent border-b-2 border-slate-100 dark:border-slate-800">
                {products.length < 4 && (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all w-full h-full"
                  >
                    <Plus className="w-8 h-8 text-primary-500 mb-2" />
                    <span className="text-sm font-bold text-slate-500">Add Item</span>
                  </button>
                )}
              </th>
              {products.map(p => (
                <th key={p.id} className="p-4 align-top text-center border-b-2 border-slate-100 dark:border-slate-800">
                  <div className="relative group bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <button 
                      onClick={() => removeProduct(p.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img src={p.imageUrl} alt={p.name} className="w-24 h-24 object-contain mx-auto mb-3" />
                    <h3 className="font-bold text-sm line-clamp-2 mb-2">{p.name}</h3>
                    <div className="text-primary-600 font-extrabold flex items-center justify-center text-lg">
                      <IndianRupee className="w-4 h-4 mr-0.5" />
                      {p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSpecLabels.map(label => (
              <tr key={label} className="group border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-6 px-4 font-bold text-xs uppercase tracking-widest text-slate-400 align-top">{label}</td>
                {products.map(p => {
                  const spec = p.specs.find(s => s.label === label);
                  return (
                    <td key={p.id} className="p-6 text-sm font-medium align-top text-center">
                      {spec ? (
                        <div className="space-y-2">
                           {spec.value}
                           {spec.isHighlightable && (
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                  Top Spec
                                </span>
                              </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add to Comparison</h2>
                    <button onClick={() => setIsSearchOpen(false)}><X /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {allProducts.filter(p => !ids.includes(p.id)).map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => addProduct(p.id)}
                            className="flex items-center p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-primary-500 transition-all group"
                        >
                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                            <div className="flex-grow">
                                <h4 className="font-bold">{p.name}</h4>
                                <p className="text-sm text-slate-500">{p.brand} • ₹{p.price.toLocaleString('en-IN')}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                    ))}
                    {allProducts.length === ids.length && <p className="text-center text-slate-500">No more products to add.</p>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;
