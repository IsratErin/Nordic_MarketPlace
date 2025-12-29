import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { PaymentMethodType } from "../types/order.types";

const PAYMENT_METHODS: PaymentMethodType[] = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "klarna", name: "Klarna", icon: ShieldCheck, badge: "Pay Later" },
  { id: "swish", name: "Swish", icon: CheckCircle2 },
];

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (methodId: string) => void;
}

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) {
  return (
    <div className="space-y-2">
      <div className=" flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-700" />
        <span className="text-base font-semibold text-gray-900">
          Payment Method
        </span>
      </div>
      <div className="space-y-1">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onMethodChange(method.id)}
            className={`w-full flex items-center gap-2 p-2 border-2 transition-all hover:border-gray-400 ${
              selectedMethod === method.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all
    ${
      selectedMethod === method.id
        ? "border-gray-600 bg-gray-100"
        : "border-gray-300 bg-white"
    }
  `}
            >
              {selectedMethod === method.id && (
                <span className="w-3 h-3 rounded-full bg-gray-900 block" />
              )}
            </span>

            <method.icon className="w-4 h-4 text-gray-700" />

            <span className="text-xs font-medium text-gray-900">
              {method.name}
            </span>

            {method.badge && (
              <Badge
                variant="secondary"
                className="ml-auto text-[10px] bg-blue-50 text-blue-700"
              >
                {method.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 mt-2 flex items-start gap-1">
        <ShieldCheck className="w-3 h-3 flex-shrink-0 mt-0.5" />
        Your payment information is encrypted and secure.
      </p>
    </div>
  );
}
