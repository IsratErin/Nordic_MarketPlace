import React from "react";
import { ProductCard } from "./productCard";
import type { Product } from "../types/product.types";
import { Loader2 } from "lucide-react";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (productId: Product["id"]) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  error = null,
  onAddToCart,
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">
            Error Loading Products
          </p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            No products found
          </p>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
        </div>
      </div>
    );
  }

  // Product grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
