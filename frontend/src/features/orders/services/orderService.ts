import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINT } from "../../../api/endpoint";
import type {
  CreateOrderDTO,
  CreateOrderResponse,
  Order,
} from "../types/order.types";

// Custom error class for order service operations
export class OrderServiceError extends Error {
  readonly code?: number;
  readonly originalError?: unknown;

  constructor(message: string, code?: number, originalError?: unknown) {
    super(message);
    this.name = "OrderServiceError";
    this.code = code;
    this.originalError = originalError;
  }
}

export const orderService = {
  async createOrder(orderData: CreateOrderDTO): Promise<Order> {
    try {
      const response = await apiClient.post<CreateOrderResponse>(
        API_ENDPOINT.ORDERS.Create_Order,
        orderData
      );
      return response.order;
    } catch (error) {
      throw new OrderServiceError("Failed to create order", undefined, error);
    }
  },
};

export const { createOrder } = orderService; // Named export for easier imports
