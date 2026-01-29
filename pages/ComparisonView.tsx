
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../db';
import { ComparisonPage, Product } from '../types';
import { ArrowLeft, IndianRupee, Trophy, CheckCircle2, Loader2 } from 'lucide-react';

const ComparisonView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [comp, setComp] = useState<ComparisonPage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const comps = await api.comparisons.getAll();
        const found = comps.find(c => c.slug === slug);
        if (found) {
          setComp(found);
          const allProducts = await api.products.getAll();
          setProducts(found.productIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;
  if (!comp) return <div className="py-20 text-center">Comparison page not found.</div>;

  const allSpecLabels = Array.from(new Set(products.flatMap(p => p.specs.map(s => s.label))));

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-bold mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </Link>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">{comp.title}</h1>
        <p className="text-xl text-slate-500">Cloud synced side-by-side technical comparison</p>
      </div>

      <div className="overflow-x-auto rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-10 w-1/5 text-left bg-slate-50 dark:bg-slate-900/50">
                 <div className="flex items-center space-x-2 text-primary-600">
                    <Trophy className="w-8 h-8" />
                    <span className="font-black text-xl">The Winner?</span>
                 </div>
              </th>
              {products.map(p => (
                <th key={p.id} className="p-10 text-center align-top border-l border-slate-100 dark:border-slate-800">
                   <div className="space-y-4">
                     <img src={p.imageUrl} className="w-32 h-32 object-contain mx-auto" alt={p.name} />
                     <h3 className="font-black text-xl leading-tight line-clamp-2">{p.name}</h3>
                     <div className="text-2xl font-black text-primary-600">₹{p.price.toLocaleString('en-IN')}</div>
                     <Link to={`/product/${p.slug}`} className="inline-block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600">Full Details</Link>
                   </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSpecLabels.map(label => (
              <tr key={label} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <td className="p-8 font-black text-xs uppercase tracking-[0.2em] text-slate-400 bg-slate-50 dark:bg-slate-900/50">{label}</td>
                {products.map(p => {
                  const spec = p.specs.find(s => s.label === label);
                  return (
                    <td key={p.id} className="p-8 text-center text-lg font-bold border-l border-slate-100 dark:border-slate-800">
                      {spec ? (
                        <div className="flex flex-col items-center">
                          {spec.value}
                          {spec.isHighlightable && <CheckCircle2 className="w-5 h-5 mt-2 text-green-500" />}
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonView;
