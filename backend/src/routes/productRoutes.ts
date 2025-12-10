import { Router } from 'express';
import {
  getAllProducts,
  getProductInfo,
  getAllProductsByCategory,
  addNewProduct,
} from '../controllers/productController.js';

const router = Router();

router.get(`/`, getAllProducts);
router.get(`/:id`, getProductInfo);
router.get(`/category/:categoryId`, getAllProductsByCategory);

//admin routes
router.post(`/admin/addProduct`,addNewProduct)

export default router;
