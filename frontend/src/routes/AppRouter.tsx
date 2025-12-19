import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import MainLayout from "../shared/layouts/MainLayout";

/* Lazy-loaded pages  */
const ProductsPage = lazy(
  () => import("../features/products/pages/ProductsPage")
);
const ProductDetailPage = lazy(
  () => import("../features/products/pages/ProductDetailPage")
);

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* Public Product routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
