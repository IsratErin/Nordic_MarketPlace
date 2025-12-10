import { Router } from 'express';
import { createNewOrder } from '../controllers/orderController.js';

const router = Router();

router.post(`/create`, createNewOrder);
export default router;
