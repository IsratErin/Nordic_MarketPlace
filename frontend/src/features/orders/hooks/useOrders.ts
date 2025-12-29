import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { createOrderThunk } from "../store/orderThunks";
import {
  clearOrderError,
  clearOrderSuccess,
  setCurrentOrder,
} from "../store/orderSlice";
import type { CreateOrderDTO } from "../types/order.types";

export function useOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id); // adjust path as needed

  const { currentOrder, loading, error, ui } = useSelector(
    (state: RootState) => state.orders
  );

  const createOrder = useCallback(
    async (orderData: CreateOrderDTO) => {
      const result = await dispatch(
        createOrderThunk({ ...orderData, userId })
      ).unwrap();
      return result;
    },
    [dispatch, userId]
  );

  const clearError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const clearSuccess = useCallback(() => {
    dispatch(clearOrderSuccess());
  }, [dispatch]);

  const resetCurrentOrder = useCallback(() => {
    dispatch(setCurrentOrder(null));
  }, [dispatch]);

  return {
    currentOrder,
    loading: loading.createOrder,
    error: error.createOrder,
    isOrderPlaced: ui.isOrderPlaced,
    lastOrderId: ui.lastOrderId,
    createOrder,
    clearError,
    clearSuccess,
    resetCurrentOrder,
  };
}
