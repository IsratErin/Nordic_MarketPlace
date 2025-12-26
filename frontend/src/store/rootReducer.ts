import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "../features/products/store/productSlice";
import authReducer from "../features/auth/store/authSlice";
import cartReducer from "../features/cart/store/cartSlice";
// Feature reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
});

export default rootReducer;
