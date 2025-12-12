import { Router } from 'express';
import { getOrderStatus, updateOrderStatus } from '../controllers/trackingController.js';

const router = Router();

router.get(`/status/:orderId`, getOrderStatus);
router.patch(`/update/:orderId`, updateOrderStatus);

export default router;
