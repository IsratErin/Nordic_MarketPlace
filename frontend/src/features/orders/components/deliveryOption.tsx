import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Home, MapPin } from "lucide-react";
import type { DeliveryAddress } from "../types/order.types";

interface DeliveryOptionProps {
  address: DeliveryAddress;
  onAddressChange: (field: keyof DeliveryAddress, value: string) => void;
  errors?: Partial<DeliveryAddress>;
}

export function DeliveryOption({
  address,
  onAddressChange,
  errors = {},
}: DeliveryOptionProps) {
  return (
    <div className="border border-gray-200">
      <div className=" px-4 py-2 flex items-center gap-1">
        <Truck className="w-5 h-5 text-gray-700" />
        <span className="text-lg font-semibold text-gray-900">
          Delivery Address
        </span>
      </div>

      <div className="px-4 py-2 space-y-2">
        {/* Street Address */}
        <div className="space-y-1">
          <Label htmlFor="street" className="text-sm font-medium text-gray-700">
            Street Address *
          </Label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="street"
              type="text"
              placeholder="Enter street address"
              className={`pl-10 h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${
                errors.street ? "border-red-500" : ""
              }`}
              value={address.street}
              onChange={(e) => onAddressChange("street", e.target.value)}
            />
          </div>
          {errors.street && (
            <p className="text-xs text-red-600">{errors.street}</p>
          )}
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              City *
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="City"
              className={`h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${
                errors.city ? "border-red-500" : ""
              }`}
              value={address.city}
              onChange={(e) => onAddressChange("city", e.target.value)}
            />
            {errors.city && (
              <p className="text-xs text-red-600">{errors.city}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="postalCode"
              className="text-sm font-medium text-gray-700"
            >
              Postal Code *
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="123 45"
              className={`h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${
                errors.postalCode ? "border-red-500" : ""
              }`}
              value={address.postalCode}
              onChange={(e) => onAddressChange("postalCode", e.target.value)}
            />
            {errors.postalCode && (
              <p className="text-xs text-red-600">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1">
          <Label
            htmlFor="country"
            className="text-sm font-medium text-gray-700"
          >
            Country
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="country"
              type="text"
              className="pl-10 h-10 border-gray-300 bg-gray-50"
              value={address.country}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
