export type OrderStatus = "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// user related to the order
export interface OrderOwner {
  id: number;
  name: string;
  email: string;
}

//order interface
export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: OrderOwner; // Optional for now as it may not always be included
}

export interface CreateOrderDTO {
  productIds: number[]; // Array of product IDs to include in the order
}

export interface CreateOrderResponse {
  order: Order;
  message: string;
}

// Redux state interface
export interface OrderState {
  // Ongoing order
  currentOrder: Order | null;

  // Loading states
  loading: {
    createOrder: boolean;
  };

  // Error states
  error: {
    createOrder: string | null;
    updateStatus: string | null;
  };

  // UI states
  ui: {
    isOrderPlaced: boolean; // Success flag after order creation
    lastOrderId: number | null; // Tracking most recent placed order for success page
  };
}

// Calculated order summary
export interface OrderSummary {
  subtotal: number;
  itemCount: number;
  orderId: number;
  orderDate: string;
}
