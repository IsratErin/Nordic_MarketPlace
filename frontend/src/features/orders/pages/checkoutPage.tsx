import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { OrderSummary } from "../components/orderSummary";
import { DeliveryOption } from "../components/deliveryOption";
import { PaymentMethod } from "../components/paymentMethod";
import { OrderTotal } from "../components/orderTotal";
import { TrustIndicators } from "../components/trustIndicators";
import OrderSuccess from "../components/orderSuccess";
import { useOrders } from "../hooks/useOrders";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { clearCart } from "@/features/cart/store/cartSlice";
import type { Order } from "../types/order.types";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Cart state
  const { items: cartItems, total: cartTotal } = useSelector(
    (state: RootState) => state.cart
  );

  // Order hook
  const {
    currentOrder,
    loading,
    error,
    isOrderPlaced,
    createOrder,
    clearError,
    clearSuccess,
    resetCurrentOrder,
  } = useOrders();

  // Checkout form hook
  const {
    deliveryAddress,
    selectedPayment,
    errors,
    handleAddressChange,
    setSelectedPayment,
    validateAddress,
  } = useCheckoutForm();

  // Redirect if cart is empty and no order placed
  useEffect(() => {
    if (cartItems.length === 0 && !isOrderPlaced) {
      // navigate("/cart");
    }
  }, [cartItems.length, isOrderPlaced, navigate]);

  // Create preview order
  const previewOrder: Order | null =
    cartItems.length > 0
      ? {
          id: 0,
          userId: 0,
          status: "PLACED",
          totalAmount: cartTotal,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: cartItems.map((item, index) => ({
            id: index,
            orderId: 0,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        }
      : null;

  const handleConfirmOrder = async () => {
    if (!validateAddress()) return;

    console.log("Processing order with:", {
      deliveryAddress,
      paymentMethod: selectedPayment,
    });

    const productIds = cartItems.map((item) => item.productId);

    try {
      await createOrder({ productIds }); // order is created
      toast.success("Order placed successfully!");
      dispatch(clearCart());
    } catch (err) {
      console.error("Failed to create order:", err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleGoToOrders = () => {
    clearSuccess();
    resetCurrentOrder();
    navigate("/orders"); //  orders page (will be implemented ) that will show order history
  };

  const handleContinueShopping = () => {
    clearSuccess();
    resetCurrentOrder();
    navigate("/products");
  };

  // Success page
  if (isOrderPlaced && currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 pt-1">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Order Confirmation
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-2 max-w-2xl">
          <OrderSuccess
            order={currentOrder}
            onGoToOrders={handleGoToOrders}
            onContinueShopping={handleContinueShopping}
          />
        </div>
      </div>
    );
  }

  // Checkout page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-2 py-0">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Order Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left - Order Summary */}
          <div className="order-2 lg:order-1 ">
            <OrderSummary order={previewOrder} />
          </div>

          {/* Right - Order Processing */}
          <div className="order-1 lg:order-2 space-y-4 ">
            <DeliveryOption
              address={deliveryAddress}
              onAddressChange={handleAddressChange}
              errors={errors}
            />

            <PaymentMethod
              selectedMethod={selectedPayment}
              onMethodChange={setSelectedPayment}
            />

            <OrderTotal
              totalAmount={cartTotal}
              onConfirm={handleConfirmOrder}
              loading={loading}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 max-w-7xl mx-auto">
          <TrustIndicators />
        </div>
      </div>
    </div>
  );
}
