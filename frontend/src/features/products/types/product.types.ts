export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

// DTOs (Data Transfer Objects)
export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}

//type matching with responses from backend API

export interface GetAllProductsResponse {
  products: Product[];
}

export interface GetProductByIdResponse {
  product: Product;
}

export interface GetProductsByCategoryResponse {
  productsByCategory: Product[];
}

export interface CreateProductResponse {
  newProduct: Product;
}

export interface UpdateProductResponse {
  updatedProduct: Product;
}

export interface DeleteProductResponse {
  message: string;
}

// Redux State type
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  productsByCategory: Product[];
  loading: boolean;
  error: string | null;
  // loading states for different operations
  loadingStates: {
    fetchAll: boolean;
    fetchById: boolean;
    fetchByCategory: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

// Filter/Query types
export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  inStock?: boolean;
}
