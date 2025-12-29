import { CheckCircle2 } from "lucide-react";

const TRUST_FEATURES = [
  {
    title: "Secure Payment",
    description: "Your payment information is encrypted and secure",
  },
  {
    title: "Free Shipping",
    description: "Free delivery on all orders",
  },
  {
    title: "Easy Returns",
    description: "30-day return policy for all products",
  },
] as const;

export function TrustIndicators() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {TRUST_FEATURES.map((feature) => (
          <div key={feature.title} className="space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
