import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "../features/products/store/productSlice";
import authReducer from "../features/auth/store/authSlice";

// Feature reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
});

export default rootReducer;
