import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { OrderState, Order } from "../types/order.types";
import { createOrderThunk } from "./orderThunks";

// Initial state for orders
const initialState: OrderState = {
  currentOrder: null,
  loading: {
    createOrder: false,
  },
  error: {
    createOrder: null,
    updateStatus: null,
  },
  ui: {
    isOrderPlaced: false,
    lastOrderId: null,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderState: () => initialState,
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    createOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
    clearOrderError: (state) => {
      state.error.createOrder = null;
      state.error.updateStatus = null;
    },
    clearOrderSuccess: (state) => {
      state.ui.isOrderPlaced = false;
      state.ui.lastOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading.createOrder = true;
        state.error.createOrder = null;
        state.ui.isOrderPlaced = false;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading.createOrder = false;
        state.currentOrder = action.payload;
        state.ui.isOrderPlaced = true;
        state.ui.lastOrderId = action.payload.id;
        state.error.createOrder = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading.createOrder = false;
        state.error.createOrder = action.payload || "Failed to create order";
        state.ui.isOrderPlaced = false;
      });
  },
});

export const {
  clearOrderError,
  clearOrderState,
  clearOrderSuccess,
  setCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
