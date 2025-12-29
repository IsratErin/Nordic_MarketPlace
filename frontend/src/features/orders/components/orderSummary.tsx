import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar } from "lucide-react";
import type { Order, OrderItem } from "../types/order.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface OrderSummaryProps {
  order: Order | null;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  const products = useSelector((state: RootState) => state.products.products);
  const getProductName = (id: number) =>
    products.find((p) => p.id === id)?.name;

  if (!order) {
    return (
      <Card className="w-full border-none shadow-none">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No items in your order</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate expected delivery date (5-7 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-SE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="w-full bg-gray-50 border-none rounded-none shadow-none">
      <CardHeader className="border-b ">
        <CardTitle className="text-2xl font-semibold text-gray-900 ">
          Check Your Order and Confirm
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-1">
        {/* Expected Delivery */}
        <div className="flex items-center gap-3 p-4 bg-gray-100  border border-gray-200">
          <Calendar className="w-5 h-5 text-gray-700" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Expected Delivery
            </p>
            <p className="text-sm text-gray-600">{formattedDeliveryDate}</p>
          </div>
        </div>

        {/* Order Items List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Order Items ({order.items.length})
          </h3>

          <div className="space-y-3 ">
            {order.items.map((item: OrderItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border border-gray-200  hover:border-gray-300 transition-colors"
              >
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getProductName(item.productId) || "Product Name"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {item.price} SEK
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {order.totalAmount} SEK
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{order.totalAmount} SEK</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
