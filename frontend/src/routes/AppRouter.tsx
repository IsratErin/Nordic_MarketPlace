import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import MainLayout from "../shared/layouts/mainLayout";

/* Lazy-loaded pages  */
const ProductsPage = lazy(
  () => import("../features/products/pages/productsPage")
);
const ProductDetailPage = lazy(
  () => import("../features/products/pages/productDetailPage")
);

const RegisterPage = lazy(() => import("../features/auth/pages/registerPage"));
const LoginPage = lazy(() => import("../features/auth/pages/loginPage"));

const CartPage = lazy(() => import("../features/cart/pages/cartPage"));

const CheckoutPage = lazy(
  () => import("../features/orders/pages/checkoutPage")
);

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* Product routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Authentication routes */}
        <Route element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Cart route */}
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* Order routes */}

        <Route element={<MainLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
