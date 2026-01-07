import { Outlet, Link, useNavigate } from "react-router-dom";
import { User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { logoutUser } from "../../features/auth/store/authThunks";
import Footer from "../components/footer";
import { Analytics } from "@vercel/analytics/react";
import { toast } from "react-hot-toast";

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // cart count from the redux store
  const cartCount = useSelector((state: RootState) =>
    state.cart.items ? state.cart.items.length : 0
  );

  // auth state from redux store
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Nordic Marketplace
              </h1>
            </Link>
            <nav>
              <div className="flex items-center gap-3">
                {/* User Account*/}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5 text-black-00" />
                  </Link>
                )}
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
                  to="/cart"
                  className="relative p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-black-00" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full px-1.5 font-semibold shadow">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {/* Logout button - show only when authenticated */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-black-00" />
                  </button>
                )}
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
      <Footer />
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}
