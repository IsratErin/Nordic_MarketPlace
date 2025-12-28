export const API_ENDPOINT = {
  AUTH: {
    Login: "/auth/login",
    Register: "/auth/register",
    Refresh: "/auth/refresh",
    Logout: "/auth/logout",
  },
  PRODUCTS: {
    All_Product_List: "/products",
    Product_Detail: (id: number) => `/products/${id}`,
    Products_By_Category: (categoryId: number) =>
      `/products/category/${categoryId}`,
    Create_Product: "/products/admin/addproduct",
    Update_Product: (id: number) => `/products/admin/updateproduct/${id}`,
    Delete_Product: (id: number) => `/products/admin/deleteproduct/${id}`,
  },
  ORDERS: {
    Create_Order: "/orders/user/create",
    Order_Detail: (orderId: number) => `/orders/user/info/${orderId}`,
    User_All_Orders: (userId: number) => `/orders/user/${userId}`,
  },
} as const;
