import { useState } from "react";
import type { DeliveryAddress } from "../types/order.types";

const DEFAULT_ADDRESS: DeliveryAddress = {
  street: "",
  city: "",
  postalCode: "",
  country: "Sweden",
};

// Custom hook to manage checkout form state and validation regarding delivery address
export function useCheckoutForm(
  initialAddress: DeliveryAddress = DEFAULT_ADDRESS,
  initialPayment: string = "card"
) {
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress>(initialAddress);
  const [selectedPayment, setSelectedPayment] =
    useState<string>(initialPayment);
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate delivery address fields ensuring all required fields are filled
  const validateAddress = (): boolean => {
    const newErrors: Partial<DeliveryAddress> = {};

    if (!deliveryAddress.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!deliveryAddress.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!deliveryAddress.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setDeliveryAddress(DEFAULT_ADDRESS);
    setSelectedPayment("card");
    setErrors({});
  };

  return {
    deliveryAddress,
    selectedPayment,
    errors,
    handleAddressChange,
    setSelectedPayment,
    validateAddress,
    reset,
  };
}
