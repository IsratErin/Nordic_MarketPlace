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
    <div className="w-full py-8 min-h-[260px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="text-primary" size={20} />
          <span className="font-bold text-xl">Cart Summary</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-m">Items Total</span>
          <span className="font-medium text-sm">{itemCount}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-m">Shipping</span>
          <span className="font-medium text-sm">0 SEK</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-m">Total</span>
          <span className="font-bold text-lg text-primary">
            {total.toFixed(2)} SEK
          </span>
        </div>
      </div>
      <Button
        className="w-full bg-primary text-white hover:bg-primary/90 py-4 text-base mt-1 rounded-none"
        size="sm"
        onClick={onCheckout}
        disabled={itemCount === 0}
      >
        Checkout
      </Button>
    </div>
  );
}
