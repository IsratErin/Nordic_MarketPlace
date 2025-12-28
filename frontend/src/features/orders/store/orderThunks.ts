import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateOrderDTO, Order } from "../types/order.types";
import { createOrder, OrderServiceError } from "../services/orderService";

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof OrderServiceError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred in order related operations";
};

// Thunk for creating an order
export const createOrderThunk = createAsyncThunk<
  Order,
  CreateOrderDTO,
  { rejectValue: string }
>("orders/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    return await createOrder(orderData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
