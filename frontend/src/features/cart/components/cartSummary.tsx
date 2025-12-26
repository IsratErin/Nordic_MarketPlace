import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

export default function CartSummary({
  total,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  return (
    <Card className="p-6 w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="text-primary" size={22} />
        <span className="font-semibold text-lg">Cart Summary</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Items</span>
        <span className="font-medium">{itemCount}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Total</span>
        <span className="font-bold text-xl text-primary">
          €{total.toFixed(2)}
        </span>
      </div>
      <Button
        className="w-full bg-primary text-white hover:bg-primary/90"
        size="lg"
        onClick={onCheckout}
        disabled={itemCount === 0}
      >
        Checkout
      </Button>
    </Card>
  );
}
