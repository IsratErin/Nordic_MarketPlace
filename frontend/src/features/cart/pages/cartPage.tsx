import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import CartItemList from "../components/cartItem";
import CartSummary from "../components/cartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleBrowseProducts = () => {
    setIsNavigating(true);
    // added a small delay during navigation for better UX
    setTimeout(() => {
      navigate("/products");
    }, 500);
  };

  return (
    <div className="container mx-auto px-2 py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="text-primary" size={28} />
          <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearCart}
              className="ml-auto text-gray-400 hover:text-red-500"
              aria-label="Clear cart"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>
        {items.length > 0 && (
          <CartItemList
            items={items}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
          />
        )}
        {items.length === 0 && (
          <Card className="p-8 flex flex-col items-center justify-center text-center bg-white border border-gray-200 min-h-[400px] rounded-none shadow-none">
            {isNavigating ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-primary font-medium">
                  Loading products...
                </span>
              </div>
            ) : (
              <>
                <span className="text-lg text-gray-500 mb-2">
                  Your cart is empty.
                </span>
                <Button
                  className="bg-primary text-white mt-2"
                  onClick={handleBrowseProducts}
                >
                  Browse Products
                </Button>
              </>
            )}
          </Card>
        )}
      </div>

      {items.length > 0 && (
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-gray-100 border border-gray-200  p-6  space-y-3">
            {/* Cart Summary */}
            <CartSummary
              total={total}
              itemCount={items.reduce((sum, item) => sum + item.quantity, 0)}
              onCheckout={handleCheckout}
            />

            <hr className="my-1" />

            {/* Discount Code Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Discount code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary text-white px-4 py-2 hover:bg-primary/90 transition">
                  Apply
                </button>
              </div>
            </div>

            <hr className="my-3" />

            {/* Payment Methods Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Payment Methods</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-3 py-1 border rounded bg-gray-50">
                  Swish
                </span>
                <span className="px-3 py-1 border rounded bg-gray-50">
                  PayPal
                </span>
                <span className="px-3 py-1 border rounded bg-gray-50">
                  Visa
                </span>
                <span className="px-3 py-1 border rounded bg-gray-50">
                  Klarna
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
