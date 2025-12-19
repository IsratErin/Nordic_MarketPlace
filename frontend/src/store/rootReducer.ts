import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "../features/products/store/productSlice";

// Feature reducers
const rootReducer = combineReducers({
  products: productReducer,
});

export default rootReducer;
