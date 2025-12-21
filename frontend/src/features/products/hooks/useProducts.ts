import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  fetchAllProducts,
  fetchProductsByCategory,
} from "../store/productThunks";
import { clearError } from "../store/productSlice";
import type { ProductFilters } from "../types/product.types";
import { useDebounce } from "@/shared/hooks/useDebounce";

// Fetches products from Redux, applies filters, and debounces search & API calls.
export function useProducts(filters: ProductFilters = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, productsByCategory } = useSelector(
    (state: RootState) => state.products
  );

  // Debounce searchQuery and categoryId to optimize performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);
  const debouncedCategoryId = useDebounce(filters.categoryId, 300);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedCategoryId) {
        dispatch(fetchProductsByCategory(debouncedCategoryId));
      } else {
        dispatch(fetchAllProducts());
      }
    }, 0); // 0ms because debounce is already applied

    return () => clearTimeout(handler);
  }, [dispatch, debouncedCategoryId]);

  // Filter products in-memory for price, search, and stock
  const filteredProducts = (debouncedCategoryId ? productsByCategory : products)
    .filter((product) =>
      debouncedSearchQuery
        ? product.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        : true
    )
    .filter(
      (product) =>
        filters.minPrice === undefined || product.price >= filters.minPrice
    )
    .filter(
      (product) =>
        filters.maxPrice === undefined || product.price <= filters.maxPrice
    )
    .filter((product) => {
      let inStockMatch = true;
      if (filters.inStock !== undefined) {
        inStockMatch = filters.inStock
          ? product.stock > 0
          : product.stock === 0;
      }
      return inStockMatch;
    });

  const clearProductError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    products: filteredProducts,
    loading,
    error,
    clearError: clearProductError,
  };
}
