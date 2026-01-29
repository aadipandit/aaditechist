
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../db';
import { Product } from '../types';
import { IndianRupee, ArrowLeft, ArrowRightLeft, Share2, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const products = await api.products.getAll();
        const found = products.find(p => p.slug === slug);
        if (found) {
          setProduct(found);
          window.scrollTo(0, 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;
  if (!product) return <div className="py-20 text-center">Product not found.</div>;

  return (
    <div className="space-y-12 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain mx-auto mix-blend-multiply dark:mix-blend-normal" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-400 text-xs uppercase tracking-wider">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{product.name}</h1>
            <div className="flex items-center text-3xl font-bold text-slate-900 dark:text-white">
              <IndianRupee className="w-6 h-6 mr-1" />
              {product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-4">
            <button 
                onClick={() => navigate(`/compare?ids=${product.id}`)}
                className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-colors shadow-lg"
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span>Compare Now</span>
            </button>
            <button className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {product.specs.slice(0, 3).map(spec => (
                <div key={spec.key} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider font-semibold">{spec.label}</span>
                    <span className="text-sm font-bold block">{spec.value}</span>
                </div>
             ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 grid grid-cols-3 gap-4 text-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex flex-col items-center"><Truck className="mb-2 text-primary-500" /> Free Shipping</div>
            <div className="flex flex-col items-center"><RefreshCw className="mb-2 text-primary-500" /> 7 Day Replacement</div>
            <div className="flex flex-col items-center"><ShieldCheck className="mb-2 text-primary-500" /> 1 Year Warranty</div>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-2xl font-bold">Technical Specifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {product.specs.map((spec) => (
            <div key={spec.key} className="grid grid-cols-1 md:grid-cols-3 p-6 gap-2 md:gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{spec.label}</div>
              <div className="md:col-span-2 text-lg font-medium">{spec.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
