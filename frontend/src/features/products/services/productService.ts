import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINT } from "../../../api/endpoint";
import type {
  Product,
  GetAllProductsResponse,
  GetProductByIdResponse,
  GetProductsByCategoryResponse,
  CreateProductDTO,
  CreateProductResponse,
  UpdateProductDTO,
  UpdateProductResponse,
  DeleteProductResponse,
} from "../types/product.types";

// Custom error class for product service operations for better error handling and debugging

export class ProductServiceError extends Error {
  readonly code?: number; //readonly for immutability
  readonly originalError?: unknown;

  constructor(message: string, code?: number, originalError?: unknown) {
    super(message);
    this.name = "ProductServiceError";
    this.code = code;
    this.originalError = originalError;
  }
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<GetAllProductsResponse>(
        API_ENDPOINT.PRODUCTS.All_Product_List
      );
      return response.products;
    } catch (error) {
      throw new ProductServiceError(
        "Failed to fetch products",
        undefined,
        error
      );
    }
  },

  async getProductById(productId: number): Promise<Product> {
    try {
      const response = await apiClient.get<GetProductByIdResponse>(
        API_ENDPOINT.PRODUCTS.Product_Detail(productId)
      );
      return response.product;
    } catch (error) {
      throw new ProductServiceError(
        `Failed to fetch product with ID ${productId}`,
        undefined,
        error
      );
    }
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const response = await apiClient.get<GetProductsByCategoryResponse>(
        API_ENDPOINT.PRODUCTS.Products_By_Category(categoryId)
      );
      return response.productsByCategory;
    } catch (error) {
      throw new ProductServiceError(
        `Failed to fetch products for category ${categoryId} `,
        undefined,
        error
      );
    }
  },

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const response = await apiClient.post<CreateProductResponse>(
        API_ENDPOINT.PRODUCTS.Create_Product,
        productData
      );
      return response.newProduct;
    } catch (error) {
      throw new ProductServiceError(
        "Failed to create product",
        undefined,
        error
      );
    }
  },

  async updateProduct(
    productId: number,
    productData: UpdateProductDTO
  ): Promise<Product> {
    try {
      const response = await apiClient.patch<UpdateProductResponse>(
        API_ENDPOINT.PRODUCTS.Update_Product(productId),
        productData
      );
      return response.updatedProduct;
    } catch (error) {
      throw new ProductServiceError(
        `Failed to update product with ID ${productId}`,
        undefined,
        error
      );
    }
  },

  async deleteProduct(productId: number): Promise<string> {
    try {
      const response = await apiClient.delete<DeleteProductResponse>(
        API_ENDPOINT.PRODUCTS.Delete_Product(productId)
      );
      return response.message;
    } catch (error) {
      throw new ProductServiceError(
        `Failed to delete product with ID ${productId}`,
        undefined,
        error
      );
    }
  },
};

export const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = productService; // Exporting individual functions for easier imports
