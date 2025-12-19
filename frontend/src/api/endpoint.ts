export const API_ENDPOINTS = {
  PRODUCTS: {
    All_Product_List: "/products",
    Product_Detail: (id: number) => `/products/${id}`,
    Products_By_Category: (categoryId: number) =>
      `/products/category/${categoryId}`,
    Create_Product: "/products/admin/addproduct",
    Update_Product: (id: number) => `/products/admin/update/${id}`,
    Delete_Product: (id: number) => `/products/admin/delete/${id}`,
  },
} as const;
