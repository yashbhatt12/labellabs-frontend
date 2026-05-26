'use client';

import Link from 'next/link';
import { Product } from '@/app/types';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

interface ProductCardProps {
  product: Product;
  manufacturerColor?: string;
  onAddToCart?: (productId: string) => void;
}

const manufacturerColors: Record<string, string> = {
  avery: 'bg-teal-100 text-teal-800',
  'avery dennison': 'bg-teal-100 text-teal-800',
  zebra: 'bg-purple-100 text-purple-800',
  tsc: 'bg-red-100 text-red-800',
  impinj: 'bg-amber-100 text-amber-800',
  citizen: 'bg-blue-100 text-blue-800',
  epson: 'bg-green-100 text-green-800',
};

export default function ProductCard({ product, manufacturerColor, onAddToCart }: ProductCardProps) {
  const badgeClass =
    manufacturerColor ||
    manufacturerColors[product.manufacturer.toLowerCase()] ||
    'bg-gray-100 text-gray-800';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card p-4 hover:shadow-lg transition-all duration-300 h-full cursor-pointer">
        {/* Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>
            {product.manufacturer}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-sm">Product Image</div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
            title="Add to Wishlist"
          >
            <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm hover:text-brand-navy transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500">SKU: {product.sku}</p>

          {product.inStock ? (
            <div className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              In Stock
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              Out of Stock
            </div>
          )}

          {/* Price */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-lg font-bold text-brand-navy">{formatCurrency(product.price)}</p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full mt-3 flex items-center justify-center gap-2 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
