
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../db';
import { Product } from '../types';
import { IndianRupee, ArrowLeft, ArrowRightLeft, Share2, ShieldCheck, Truck, RefreshCw, Loader2, ExternalLink } from 'lucide-react';

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
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 transition-colors font-bold">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24 overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain mx-auto transition-transform hover:scale-110 duration-700" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-primary-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">{product.name}</h1>
            <div className="flex items-center text-4xl font-black text-primary-600">
              <IndianRupee className="w-8 h-8 mr-1" />
              {product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            {product.affiliateUrl && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-5 bg-primary-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/40"
              >
                <span>{product.buyButtonText || 'Buy Now'}</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <button 
                onClick={() => navigate(`/compare?ids=${product.id}`)}
                className="flex-1 flex items-center justify-center space-x-2 py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] font-black text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span>Compare</span>
            </button>
            <button className="p-5 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {product.specs.slice(0, 3).map(spec => (
                <div key={spec.key} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-widest font-black">{spec.label}</span>
                    <span className="text-sm font-bold block">{spec.value}</span>
                </div>
             ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 grid grid-cols-3 gap-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex flex-col items-center"><Truck className="mb-2 text-primary-500 w-5 h-5" /> Fast Delivery</div>
            <div className="flex flex-col items-center"><RefreshCw className="mb-2 text-primary-500 w-5 h-5" /> Verified Specs</div>
            <div className="flex flex-col items-center"><ShieldCheck className="mb-2 text-primary-500 w-5 h-5" /> Brand Warranty</div>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-2xl font-black tracking-tight">Technical Specifications</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {product.specs.map((spec) => (
            <div key={spec.key} className="grid grid-cols-1 md:grid-cols-3 p-8 gap-2 md:gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</div>
              <div className="md:col-span-2 text-lg font-bold">{spec.value || 'Not Specified'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
