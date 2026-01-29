
import React, { useState, useEffect } from 'react';
import { api, getNews } from '../db';
import { Product, Category, Spec, CATEGORY_TEMPLATES, ComparisonPage, BudgetListPage } from '../types';
import { Plus, Trash2, Edit3, Save, Lock, Smartphone, ArrowRightLeft, DollarSign, Loader2, Database } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'comparisons' | 'budget'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonPage[]>([]);
  const [budgetLists, setBudgetLists] = useState<BudgetListPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Forms State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', brand: '', category: Category.SMARTPHONE, price: 0,
    imageUrl: 'https://picsum.photos/seed/gadget/400/300', description: '', specs: []
  });
  const [compFormData, setCompFormData] = useState<Partial<ComparisonPage>>({ title: '', category: Category.SMARTPHONE, productIds: [] });
  const [budgetFormData, setBudgetFormData] = useState<Partial<BudgetListPage>>({ title: '', category: Category.SMARTPHONE, budgetLabel: '', maxPrice: 0, productIds: [], tags: {} });

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, c, b] = await Promise.all([
        api.products.getAll(),
        api.comparisons.getAll(),
        api.budgetLists.getAll()
      ]);
      setProducts(p);
      setComparisons(c);
      setBudgetLists(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  // Handle product spec template
  useEffect(() => {
    if (!formData.id && formData.category && activeTab === 'products') {
      const template = CATEGORY_TEMPLATES[formData.category as Category];
      const newSpecs: Spec[] = template.map(label => ({
        label, value: '', key: label.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }));
      setFormData(prev => ({ ...prev, specs: newSpecs }));
    }
  }, [formData.category, formData.id, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'aadiadmin') setIsAuthenticated(true);
    else alert('Incorrect password!');
  };

  const resetForms = () => {
    setFormData({ name: '', brand: '', category: Category.SMARTPHONE, price: 0, imageUrl: 'https://picsum.photos/seed/gadget/400/300', description: '', specs: [] });
    setCompFormData({ title: '', category: Category.SMARTPHONE, productIds: [] });
    setBudgetFormData({ title: '', category: Category.SMARTPHONE, budgetLabel: '', maxPrice: 0, productIds: [], tags: {} });
    setIsEditing(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const p: Product = {
        id: formData.id || Date.now().toString(),
        slug: (formData.name || '').toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        name: formData.name || '', brand: formData.brand || '', category: formData.category as Category,
        price: formData.price || 0, imageUrl: formData.imageUrl || '', description: formData.description || '',
        specs: formData.specs || [], dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0]
      };
      await api.products.save(p);
      await loadData();
      resetForms();
      alert('Product Saved to Database!');
    } finally {
      setLoading(false);
    }
  };

  const handleCompSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((compFormData.productIds?.length || 0) < 2) return alert('Select at least 2 products');
    setLoading(true);
    try {
      const c: ComparisonPage = {
        id: compFormData.id || Date.now().toString(),
        slug: (compFormData.title || '').toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        title: compFormData.title || '', category: compFormData.category as Category,
        productIds: compFormData.productIds || [], createdAt: new Date().toISOString()
      };
      await api.comparisons.save(c);
      await loadData();
      resetForms();
      alert('Comparison Saved!');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const l: BudgetListPage = {
        id: budgetFormData.id || Date.now().toString(),
        slug: (budgetFormData.title || '').toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        title: budgetFormData.title || '', category: budgetFormData.category as Category,
        budgetLabel: budgetFormData.budgetLabel || '', maxPrice: budgetFormData.maxPrice || 0,
        productIds: budgetFormData.productIds || [], tags: budgetFormData.tags || {},
        createdAt: new Date().toISOString()
      };
      await api.budgetLists.save(l);
      await loadData();
      resetForms();
      alert('Budget List Saved!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'p' | 'c' | 'b', id: string) => {
    if (!window.confirm('Confirm deletion?')) return;
    setLoading(true);
    try {
      if (type === 'p') await api.products.delete(id);
      if (type === 'c') await api.comparisons.delete(id);
      if (type === 'b') await api.budgetLists.delete(id);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary-500 text-center font-mono" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-600 text-white rounded-2xl shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Cloud Console</h1>
            <div className="flex mt-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
              {[
                { id: 'products', label: 'Products', icon: <Smartphone className="w-4 h-4" /> },
                { id: 'comparisons', label: 'Comparisons', icon: <ArrowRightLeft className="w-4 h-4" /> },
                { id: 'budget', label: 'Budget Lists', icon: <DollarSign className="w-4 h-4" /> },
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => {setActiveTab(t.id as any); resetForms();}}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.icon} <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-3 rounded-2xl font-bold shadow-lg transition-all ${isEditing ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-600 text-white shadow-primary-500/20'}`}>
            {isEditing ? 'Cancel' : `New ${activeTab.slice(0, -1)}`}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="px-6 py-3 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-red-500">Exit</button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="font-black text-xl">Syncing Database...</p>
           </div>
        </div>
      )}

      {isEditing ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'products' && (
            <form onSubmit={handleProductSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                 <input name="brand" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="Brand" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                 <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} placeholder="Price" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {formData.specs?.map((s, idx) => (
                   <div key={idx} className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</label>
                     <input value={s.value} onChange={(e) => {
                       const ns = [...(formData.specs || [])];
                       ns[idx].value = e.target.value;
                       setFormData({...formData, specs: ns});
                     }} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs" />
                   </div>
                 ))}
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold">Publish Product to Cloud</button>
            </form>
          )}

          {activeTab === 'comparisons' && (
            <form onSubmit={handleCompSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input value={compFormData.title} onChange={(e) => setCompFormData({...compFormData, title: e.target.value})} placeholder="Comparison Page Title" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                 <select value={compFormData.category} onChange={(e) => setCompFormData({...compFormData, category: e.target.value as Category, productIds: []})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="space-y-4">
                 <h3 className="font-bold">Select Products (2-4)</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                   {products.filter(p => p.category === compFormData.category).map(p => (
                     <label key={p.id} className={`flex items-center p-3 rounded-xl cursor-pointer border transition-all ${compFormData.productIds?.includes(p.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        <input type="checkbox" className="hidden" checked={compFormData.productIds?.includes(p.id)} onChange={() => {
                          const ids = compFormData.productIds || [];
                          const nids = ids.includes(p.id) ? ids.filter(i => i !== p.id) : [...ids, p.id];
                          if (nids.length <= 4) setCompFormData({...compFormData, productIds: nids});
                        }} />
                        <span className="text-sm font-bold">{p.name}</span>
                     </label>
                   ))}
                 </div>
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold">Save Comparison to Cloud</button>
            </form>
          )}

          {activeTab === 'budget' && (
            <form onSubmit={handleBudgetSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <input value={budgetFormData.title} onChange={(e) => setBudgetFormData({...budgetFormData, title: e.target.value})} placeholder="Budget List Title" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                 <select value={budgetFormData.category} onChange={(e) => setBudgetFormData({...budgetFormData, category: e.target.value as Category, productIds: []})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <div className="flex space-x-2">
                    <input value={budgetFormData.budgetLabel} onChange={(e) => setBudgetFormData({...budgetFormData, budgetLabel: e.target.value})} placeholder="Label (Under 50k)" className="flex-grow px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                    <input type="number" value={budgetFormData.maxPrice} onChange={(e) => setBudgetFormData({...budgetFormData, maxPrice: parseFloat(e.target.value)})} placeholder="Max Price" className="w-24 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800" required />
                 </div>
               </div>
               <div className="space-y-4">
                 <h3 className="font-bold">Ranking & Selection</h3>
                 <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                    {products.filter(p => p.category === budgetFormData.category && p.price <= (budgetFormData.maxPrice || Infinity)).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                          <input type="checkbox" checked={budgetFormData.productIds?.includes(p.id)} onChange={() => {
                            const ids = budgetFormData.productIds || [];
                            setBudgetFormData({...budgetFormData, productIds: ids.includes(p.id) ? ids.filter(i => i !== p.id) : [...ids, p.id]});
                          }} />
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{p.name}</span>
                            <span className="text-xs text-primary-600 font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                          </div>
                        </label>
                        {budgetFormData.productIds?.includes(p.id) && (
                          <select 
                            value={budgetFormData.tags?.[p.id] || ''} 
                            onChange={(e) => setBudgetFormData({...budgetFormData, tags: {...budgetFormData.tags, [p.id]: e.target.value}})}
                            className="bg-white dark:bg-slate-700 text-[10px] font-bold p-2 rounded-lg border border-slate-200 dark:border-slate-600 outline-none"
                          >
                            <option value="">No Special Tag</option>
                            <option value="Best Performance">Best Performance</option>
                            <option value="Best Battery Life">Best Battery Life</option>
                            <option value="Best for Students">Best for Students</option>
                            <option value="Best for Gaming">Best for Gaming</option>
                            <option value="Value For Money">Value For Money</option>
                          </select>
                        )}
                      </div>
                    ))}
                 </div>
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold">Save Budget List to Cloud</button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
           {activeTab === 'products' && products.map(p => (
             <div key={p.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border rounded-3xl hover:border-primary-500 transition-colors">
               <div className="flex items-center space-x-4">
                 <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                 <div><h4 className="font-bold">{p.name}</h4><p className="text-xs text-slate-500">{p.category} • ₹{p.price.toLocaleString('en-IN')}</p></div>
               </div>
               <button onClick={() => handleDelete('p', p.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
             </div>
           ))}
           {activeTab === 'comparisons' && comparisons.map(c => (
             <div key={c.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border rounded-3xl hover:border-primary-500 transition-colors">
                <div><h4 className="font-bold">{c.title}</h4><p className="text-xs text-slate-500">{c.category} • {c.productIds.length} Products</p></div>
                <button onClick={() => handleDelete('c', c.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
             </div>
           ))}
           {activeTab === 'budget' && budgetLists.map(l => (
             <div key={l.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border rounded-3xl hover:border-primary-500 transition-colors">
                <div><h4 className="font-bold">{l.title}</h4><p className="text-xs text-slate-500">{l.category} • {l.budgetLabel}</p></div>
                <button onClick={() => handleDelete('b', l.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
