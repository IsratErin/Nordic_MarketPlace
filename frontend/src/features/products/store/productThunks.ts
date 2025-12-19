import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  productService,
  ProductServiceError,
} from "../services/productService";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/product.types";

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof ProductServiceError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// sliceName/actionDescription = products/fetchAll (redux action naming convention)
export const fetchAllProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await productService.getAllProducts();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchById", async (productId, { rejectWithValue }) => {
  try {
    return await productService.getProductById(productId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  Product[],
  number,
  { rejectValue: string }
>("products/fetchByCategory", async (categoryId, { rejectWithValue }) => {
  try {
    return await productService.getProductsByCategory(categoryId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Admin-only
export const createProduct = createAsyncThunk<
  Product,
  CreateProductDTO,
  { rejectValue: string }
>("products/create", async (productData, { rejectWithValue }) => {
  try {
    return await productService.createProduct(productData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; data: UpdateProductDTO },
  { rejectValue: string }
>("products/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await productService.updateProduct(id, data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/delete", async (productId, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(productId);
    return productId; // Return the deleted product ID for state update
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
