import { useState } from "react";
import { ProductList } from "../components/productList";
import { ProductFilter } from "../components/productFilter";
import { AddProductModal } from "../components/addProductModal";
import { EditProductModal } from "../components/editProductModal";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/productThunks";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import type {
  ProductFilters,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/product.types";
import { addToCart } from "@/features/cart/store/cartSlice";

// Mock categories for now
const mockCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Sports & Outdoors" },
];

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Get isAdmin from useAuth hook so that we can render product list with with each product card with admin capabilities
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<ProductFilters>({});
  const { products, loading, error } = useProducts(filters);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleAddToCart = async (productId: number) => {
    const cartItem = products.find((p) => p.id === productId);
    if (!cartItem) {
      console.error("Product not found to add to cart with id:", productId);
      return;
    }
    dispatch(
      addToCart({
        productId: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: 1,
        stock: cartItem.stock,
      })
    );
    console.log("Added to cart:", productId);
    alert(`Product ${productId} added to cart!`);
  };

  // Admin handlers
  const handleCreateProduct = async (data: CreateProductDTO) => {
    await dispatch(createProduct(data));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (id: number, data: UpdateProductDTO) => {
    await dispatch(updateProduct({ id, data }));
  };

  const handleDeleteProduct = async (productId: number) => {
    if (
      globalThis.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      await dispatch(deleteProduct(productId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Badge Banner */}
      {isAdmin && (
        <div className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              <span className="font-semibold">Admin Mode</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">
                You have full product management access
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header with filter bar and Add Product button */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <ProductFilter
              filters={filters}
              categories={mockCategories}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Admin Add Product Button */}
            {isAdmin && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product List, Inside product list we have each product card that also tracks if the user is an admin */}
      <div className="container mx-auto px-4 py-6">
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          onEdit={isAdmin ? handleEditProduct : undefined}
          onDelete={isAdmin ? handleDeleteProduct : undefined}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateProduct}
          categories={mockCategories}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
          categories={mockCategories}
        />
      )}
    </div>
  );
}
