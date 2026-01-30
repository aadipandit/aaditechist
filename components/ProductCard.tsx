
import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ArrowRightLeft, Star, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onCompare?: (id: string) => void;
  isCompareMode?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCompare, isCompareMode }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {product.price < 20000 && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-lg">Budget King</span>
            )}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] ml-1 text-slate-500">4.5</span>
            </div>
        </div>
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors mb-1 truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center font-black text-xl text-slate-900 dark:text-white">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {product.price.toLocaleString('en-IN')}
            </div>
            <button
                onClick={() => onCompare?.(product.id)}
                className={`p-2 rounded-lg border transition-all ${
                  isCompareMode 
                  ? 'bg-primary-600 border-primary-600 text-white scale-110' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Add to Compare"
            >
                <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
                to={`/product/${product.slug}`}
                className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                Details
            </Link>
            {product.affiliateUrl && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20"
              >
                <span>{product.buyButtonText || 'Buy Now'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
