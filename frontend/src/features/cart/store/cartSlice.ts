import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../types/cart.types";

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const cartItem = action.payload;
      // Check if the same item already exists in cart
      const itemExists = state.items.find(
        (i) => i.productId === cartItem.productId
      );
      if (itemExists) {
        itemExists.quantity = Math.min(
          itemExists.quantity + cartItem.quantity,
          itemExists.stock
        );
      } else {
        state.items.push({
          ...cartItem, // allows safe overwrite of properties
          quantity: Math.min(cartItem.quantity, cartItem.stock),
        });
      }
      state.total = calculateTotal(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload; // extracts productId and quantity from payload
      const cartItem = state.items.find((i) => i.productId === productId);
      if (cartItem) {
        cartItem.quantity = Math.max(1, Math.min(quantity, cartItem.stock));
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
