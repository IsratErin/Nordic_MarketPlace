import { Router } from 'express';
import {
  createNewOrder,
  getOrderInfo,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';

const router = Router();

router.post(`/create`, createNewOrder);
router.get(`/info/:orderId`, getOrderInfo);
router.get(`/users/:userId`, getUserOrders);
router.patch(`/update-status/:orderId`, updateOrderStatus);
router.delete(`/delete/:orderId`, deleteOrder);

export default router;
