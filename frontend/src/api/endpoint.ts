export const API_ENDPOINT = {
  PRODUCTS: {
    All_Product_List: "/products",
    Product_Detail: (id: number) => `/products/${id}`,
    Products_By_Category: (categoryId: number) =>
      `/products/category/${categoryId}`,
    Create_Product: "/products/admin/addproduct",
    Update_Product: (id: number) => `/products/admin/updateproduct/${id}`,
    Delete_Product: (id: number) => `/products/admin/deleteproduct/${id}`,
  },
} as const;
