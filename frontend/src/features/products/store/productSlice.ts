import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, Product } from "../types/product.types";

// Initial state
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  productsByCategory: [],
  loading: false,
  error: null,
  loadingStates: {
    fetchAll: false,
    fetchById: false,
    fetchByCategory: false,
    create: false,
    update: false,
    delete: false,
  },
};

//product-related state in the application

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProductsByCategory: (state) => {
      state.productsByCategory = [];
    },
    resetProductState: () => initialState, // Resets to initial state

    updateProductInfo: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Product> }>
    ) => {
      const { id, data } = action.payload; // Destructure id and data

      // Update the specific product info in the list of products
      const productIndex = state.products.findIndex((p) => p.id === id);
      if (productIndex !== -1) {
        state.products[productIndex] = {
          ...state.products[productIndex],
          ...data,
        };
      }

      // Update also the selected product with updated data info
      if (state.selectedProduct?.id === id) {
        state.selectedProduct = {
          ...state.selectedProduct,
          ...data,
        };
      }

      // Update also in category-specific products list if the product belongs to that category
      const categoryProductIndex = state.productsByCategory.findIndex(
        (p) => p.id === id
      );
      if (categoryProductIndex !== -1) {
        state.productsByCategory[categoryProductIndex] = {
          ...state.productsByCategory[categoryProductIndex],
          ...data,
        };
      }
    },
  },
});

// Export actions
export const {
  clearSelectedProduct,
  clearError,
  clearProductsByCategory,
  resetProductState,
  updateProductInfo,
} = productSlice.actions;

export default productSlice.reducer;
