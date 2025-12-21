import { useState } from "react";
import { ProductList } from "../components/productList";
import { ProductFilter } from "../components/productFilter";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilters } from "../types/product.types";

// Mock categories for now
const mockCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Sports & Outdoors" },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { products, loading, error } = useProducts(filters);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleAddToCart = (productId: string | number) => {
    // Placeholder for add to cart functionality
    console.log("Add to cart:", productId);
    alert(`Product ${productId} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with filter bar */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <ProductFilter
            filters={filters}
            categories={mockCategories}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* Product List */}
      <div className="container mx-auto px-4 py-6">
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
