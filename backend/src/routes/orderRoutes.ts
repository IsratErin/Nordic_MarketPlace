import { Router } from 'express';
import {
  createNewOrder,
  getOrderInfo,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  admingetOrderInfo,
} from '../controllers/orderController.js';

const router = Router();
//user routes
router.post(`/user/create`, createNewOrder);
router.get(`/user/info/:orderId`, getOrderInfo);
router.get(`/user/:userId`, getUserOrders);
router.delete(`/user/delete/:orderId`, deleteOrder);

//admin only routes
router.get(`/admin/:orderId`, admingetOrderInfo);
router.patch(`/admin/update-status/:orderId`, updateOrderStatus);

export default router;
