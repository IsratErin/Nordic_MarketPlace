import { Router } from 'express';
import { getAllProducts, getProductInfo } from '../controllers/productController.js';

const router = Router();

router.get(`/`, getAllProducts);
router.get(`/:id`, getProductInfo);

export default router;
