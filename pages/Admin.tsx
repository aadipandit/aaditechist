
import React, { useState, useEffect } from 'react';
import { api } from '../db';
import { Product, Category, Spec, CATEGORY_TEMPLATES, ComparisonPage, BudgetListPage } from '../types';
import { Trash2, Lock, Smartphone, ArrowRightLeft, DollarSign, Loader2, Database, ExternalLink, Tag, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

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
    imageUrl: 'https://picsum.photos/seed/gadget/400/300', description: '', specs: [],
    affiliateUrl: '', buyButtonText: 'Buy Now'
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
      console.error("Cloud Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

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
    setFormData({ name: '', brand: '', category: Category.SMARTPHONE, price: 0, imageUrl: 'https://picsum.photos/seed/gadget/400/300', description: '', specs: [], affiliateUrl: '', buyButtonText: 'Buy Now' });
    setCompFormData({ title: '', category: Category.SMARTPHONE, productIds: [] });
    setBudgetFormData({ title: '', category: Category.SMARTPHONE, budgetLabel: '', maxPrice: 0, productIds: [], tags: {} });
    setIsEditing(false);
  };

  // Gemini Integration: Automatically populate product specs and description
  const handleAIFill = async () => {
    if (!formData.name || !formData.brand) {
      alert("Please enter the Brand and Model Name first.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide the full technical specifications and a short 2-sentence description for the ${formData.category}: ${formData.brand} ${formData.name}.
      Use the following specification labels: ${CATEGORY_TEMPLATES[formData.category as Category].join(', ')}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              specs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    key: { type: Type.STRING }
                  },
                  required: ['label', 'value', 'key']
                }
              }
            },
            required: ['description', 'specs']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.description && data.specs) {
        setFormData(prev => ({
          ...prev,
          description: data.description,
          specs: data.specs
        }));
        alert('Product details generated successfully!');
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      alert("AI Generation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const p: Product = {
        id: formData.id || Date.now().toString(),
        slug: (formData.name || '').toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        name: formData.name || '', brand: formData.brand || '', category: formData.category as Category,
        price: Number(formData.price) || 0, imageUrl: formData.imageUrl || '', description: formData.description || '',
        specs: formData.specs || [], dateAdded: formData.dateAdded || new Date().toISOString().split('T')[0],
        affiliateUrl: formData.affiliateUrl || '',
        buyButtonText: formData.buyButtonText || 'Buy Now'
      };
      await api.products.save(p);
      await loadData();
      resetForms();
      alert('Product Saved to Supabase!');
    } catch (err) {
      alert("Error saving: " + (err as any).message);
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
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black mb-2">Admin Security</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Dashboard Secret" className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary-500 text-center font-black tracking-widest" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg">Enter Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-primary-600 text-white rounded-[1.5rem] shadow-xl shadow-primary-500/20">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Supabase Console</h1>
            <div className="flex mt-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
              {[
                { id: 'products', label: 'Inventory', icon: <Smartphone className="w-4 h-4" /> },
                { id: 'comparisons', label: 'Versus', icon: <ArrowRightLeft className="w-4 h-4" /> },
                { id: 'budget', label: 'Guides', icon: <DollarSign className="w-4 h-4" /> },
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => {setActiveTab(t.id as any); resetForms();}}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500'}`}
                >
                  {t.icon} <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsEditing(!isEditing)} className={`px-8 py-4 rounded-2xl font-black transition-all ${isEditing ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:scale-105'}`}>
            {isEditing ? 'Cancel' : `Add ${activeTab === 'products' ? 'Gadget' : 'List'}`}
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="font-black text-xl tracking-tight">Syncing Cloud...</p>
           </div>
        </div>
      )}

      {isEditing ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'products' && (
            <form onSubmit={handleProductSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black">Manual Data Entry</h3>
                  <button 
                    type="button" 
                    onClick={handleAIFill}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate with Gemini AI</span>
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Model Name</label>
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Galaxy S24" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Brand</label>
                    <input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="Samsung" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as Category})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold">
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price (INR)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" required />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the gadget highlights..." className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium min-h-[80px]" required />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/30">
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-600 font-black text-xs uppercase tracking-widest">
                       <ExternalLink className="w-4 h-4" /> <span>Affiliate URL</span>
                    </div>
                    <input value={formData.affiliateUrl} onChange={(e) => setFormData({...formData, affiliateUrl: e.target.value})} placeholder="https://amazon.in/dp/..." className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 font-medium text-sm" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-primary-600 font-black text-xs uppercase tracking-widest">
                       <Tag className="w-4 h-4" /> <span>Button Text</span>
                    </div>
                    <input value={formData.buyButtonText} onChange={(e) => setFormData({...formData, buyButtonText: e.target.value})} placeholder="Buy on Amazon" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 font-medium text-sm" />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image URL</label>
                  <input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" required />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {formData.specs?.map((s, idx) => (
                   <div key={idx} className="space-y-1">
                     <label className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{s.label}</label>
                     <input value={s.value} onChange={(e) => {
                       const ns = [...(formData.specs || [])];
                       ns[idx].value = e.target.value;
                       setFormData({...formData, specs: ns});
                     }} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold" />
                   </div>
                 ))}
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary-500/40 hover:scale-[1.02] transition-transform">Push to Live Inventory</button>
            </form>
          )}

          {activeTab === 'comparisons' && (
            <form onSubmit={handleCompSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input value={compFormData.title} onChange={(e) => setCompFormData({...compFormData, title: e.target.value})} placeholder="Comparison Page Title" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black" required />
                 <select value={compFormData.category} onChange={(e) => setCompFormData({...compFormData, category: e.target.value as Category, productIds: []})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="space-y-4">
                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Select Gadgets</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                   {products.filter(p => p.category === compFormData.category).map(p => (
                     <label key={p.id} className={`flex items-center p-4 rounded-2xl cursor-pointer border transition-all ${compFormData.productIds?.includes(p.id) ? 'border-primary-500 bg-white dark:bg-slate-700 shadow-lg scale-105' : 'border-transparent text-slate-400'}`}>
                        <input type="checkbox" className="hidden" checked={compFormData.productIds?.includes(p.id)} onChange={() => {
                          const ids = compFormData.productIds || [];
                          const nids = ids.includes(p.id) ? ids.filter(i => i !== p.id) : [...ids, p.id];
                          if (nids.length <= 4) setCompFormData({...compFormData, productIds: nids});
                        }} />
                        <span className="text-xs font-black uppercase tracking-tight">{p.name}</span>
                     </label>
                   ))}
                 </div>
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary-500/40">Create Comparison Page</button>
            </form>
          )}

          {activeTab === 'budget' && (
            <form onSubmit={handleBudgetSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <input value={budgetFormData.title} onChange={(e) => setBudgetFormData({...budgetFormData, title: e.target.value})} placeholder="Budget List Title" className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black" required />
                 <select value={budgetFormData.category} onChange={(e) => setBudgetFormData({...budgetFormData, category: e.target.value as Category, productIds: []})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <div className="flex space-x-2">
                    <input value={budgetFormData.budgetLabel} onChange={(e) => setBudgetFormData({...budgetFormData, budgetLabel: e.target.value})} placeholder="Label (Under 50k)" className="flex-grow px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black" required />
                    <input type="number" value={budgetFormData.maxPrice} onChange={(e) => setBudgetFormData({...budgetFormData, maxPrice: Number(e.target.value)})} placeholder="Limit" className="w-24 px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-black" required />
                 </div>
               </div>
               <div className="space-y-4">
                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Select Rankings</h3>
                 <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                    {products.filter(p => p.category === budgetFormData.category && p.price <= (budgetFormData.maxPrice || Infinity)).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                        <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                          <input type="checkbox" checked={budgetFormData.productIds?.includes(p.id)} onChange={() => {
                            const ids = budgetFormData.productIds || [];
                            setBudgetFormData({...budgetFormData, productIds: ids.includes(p.id) ? ids.filter(i => i !== p.id) : [...ids, p.id]});
                          }} />
                          <div className="flex flex-col">
                            <span className="font-black text-sm uppercase tracking-tight">{p.name}</span>
                            <span className="text-[10px] text-primary-600 font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                          </div>
                        </label>
                        {budgetFormData.productIds?.includes(p.id) && (
                          <select 
                            value={budgetFormData.tags?.[p.id] || ''} 
                            onChange={(e) => setBudgetFormData({...budgetFormData, tags: {...budgetFormData.tags, [p.id]: e.target.value}})}
                            className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black p-2 rounded-lg border-none"
                          >
                            <option value="">No Tag</option>
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
               <button type="submit" className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black text-xl">Publish Budget Guide</button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
           {activeTab === 'products' && products.map(p => (
             <div key={p.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:shadow-xl transition-all">
               <div className="flex items-center space-x-6">
                 <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-contain bg-slate-50" />
                 <div>
                    <h4 className="font-black text-lg leading-tight uppercase tracking-tight">{p.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                       <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{p.category}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                 </div>
               </div>
               <div className="flex items-center space-x-2">
                  {p.affiliateUrl && <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ExternalLink className="w-4 h-4" /></div>}
                  <button onClick={() => handleDelete('p', p.id)} className="text-red-500 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
               </div>
             </div>
           ))}
           {activeTab === 'comparisons' && comparisons.map(c => (
             <div key={c.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
                <div><h4 className="font-black text-lg uppercase">{c.title}</h4><p className="text-[10px] font-black text-slate-400 uppercase">{c.category} • {c.productIds.length} Items</p></div>
                <button onClick={() => handleDelete('c', c.id)} className="text-red-500 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
             </div>
           ))}
           {activeTab === 'budget' && budgetLists.map(l => (
             <div key={l.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
                <div><h4 className="font-black text-lg uppercase">{l.title}</h4><p className="text-[10px] font-black text-slate-400 uppercase">{l.category} • {l.budgetLabel}</p></div>
                <button onClick={() => handleDelete('b', l.id)} className="text-red-500 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
