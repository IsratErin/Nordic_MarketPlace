import { Button } from "@/components/ui/button";
import type { Order } from "../types/order.types";

interface OrderSuccessProps {
  order: Order;
  onGoToOrders: () => void;
  onContinueShopping: () => void;
}

export default function OrderSuccess({
  order,
  onGoToOrders,
  onContinueShopping,
}: OrderSuccessProps) {
  const totalAmount =
    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
    0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-6">
          '{/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your order. We've received your payment and will
              process your order shortly.
            </p>
          </div>
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-3 border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-semibold text-gray-900">
                {totalAmount} SEK
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-green-600">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-semibold text-gray-900">
                {order.items.length}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onGoToOrders}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
            >
              View My Orders
            </Button>
            <Button
              onClick={onContinueShopping}
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-100"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
