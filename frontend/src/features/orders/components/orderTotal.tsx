import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface OrderTotalProps {
  totalAmount: number;
  onConfirm: () => void;
  loading?: boolean;
}

export function OrderTotal({
  totalAmount,
  onConfirm,
  loading = false,
}: OrderTotalProps) {
  return (
    <div className="space-y-4">
      {/* Total Amount with VAT */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-300">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xs text-gray-500 mt-1">Including VAT</p>
        </div>
        <p className="text-3xl font-bold text-gray-900">
          {totalAmount} <span className="text-lg">SEK</span>
        </p>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={onConfirm}
        disabled={loading}
        className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Confirm and Pay
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-gray-600">
        By placing this order, you agree to our Terms & Conditions
      </p>
    </div>
  );
}
