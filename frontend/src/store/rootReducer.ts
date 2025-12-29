import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "../features/products/store/productSlice";
import authReducer from "../features/auth/store/authSlice";
import cartReducer from "../features/cart/store/cartSlice";
import orderReducer from "../features/orders/store/orderSlice";
// Feature reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
});

export default rootReducer;
