import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductState, Product } from "../types/product.types";
import {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunks";

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
  extraReducers: (builder) => {
    //fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loadingStates.fetchAll = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loadingStates.fetchAll = false;
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loadingStates.fetchAll = false;
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loadingStates.fetchById = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loadingStates.fetchById = false;
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;

        // update in products list with the fetched product details as action payload
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingStates.fetchById = false;
        state.loading = false;
        state.error = action.payload as string;
      });

    //fetch products by category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loadingStates.fetchByCategory = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loadingStates.fetchByCategory = false;
        state.loading = false;
        state.productsByCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loadingStates.fetchByCategory = false;
        state.loading = false;
        state.error = action.payload as string;
      });

    // create product (admin)
    builder
      .addCase(createProduct.pending, (state) => {
        state.loadingStates.create = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loadingStates.create = false;
        state.loading = false;
        // Add to the beginning of the list for better visibility
        state.products.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingStates.create = false;
        state.loading = false;
        state.error = action.payload as string;
      });

    // update product (admin)
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loadingStates.update = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingStates.update = false;
        state.loading = false;

        // Update the product in products list
        const productIndex = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload;
        }

        // Update selected product if it matches
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }

        // Update in category list if present
        const categoryIndex = state.productsByCategory.findIndex(
          (p) => p.id === action.payload.id
        );
        if (categoryIndex !== -1) {
          state.productsByCategory[categoryIndex] = action.payload;
        }

        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingStates.update = false;
        state.loading = false;
        state.error = action.payload as string;
      });

    //delete product (admin)
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loadingStates.delete = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingStates.delete = false;
        state.loading = false;

        const deletedId = action.payload;

        // Remove from products list
        state.products = state.products.filter((p) => p.id !== deletedId);

        // Clear selected product if it was deleted
        if (state.selectedProduct?.id === deletedId) {
          state.selectedProduct = null;
        }

        // Remove from category list if present
        state.productsByCategory = state.productsByCategory.filter(
          (p) => p.id !== deletedId
        );

        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingStates.delete = false;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {
  clearSelectedProduct,
  clearError,
  clearProductsByCategory,
  resetProductState,
  updateProductInfo,
} = productSlice.actions;

export default productSlice.reducer;
