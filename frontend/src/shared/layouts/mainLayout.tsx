import { Outlet, Link } from "react-router-dom";
import { User, Heart, ShoppingCart } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Nordic Marketplace
            </h1>
            <nav>
              <div className="flex items-center gap-3">
                {/* User Account */}
                <Link
                  to="/register"
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-black-00" />
                </Link>
                {/* Wishlist */}
                <Link
                  to="/mywishlist"
                  className="relative p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 text-black-00" />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 font-semibold shadow">
                    {/* Wishlist items will be dynamically updated here*/}
                  </span>
                </Link>
                {/* Cart */}
                <Link
                  to="/mycart"
                  className="relative p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-black-00" />
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full px-1.5 font-semibold shadow">
                    {/* Cart items will be dynamically updated here*/}
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Nordic Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
