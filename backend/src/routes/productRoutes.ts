import { Router } from 'express';
import {
  getAllProducts,
  getProductInfo,
  getAllProductsByCategory,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get(`/`, getAllProducts);
router.get(`/:id`, getProductInfo);
router.get(`/category/:categoryId`, getAllProductsByCategory);

//admin routes
router.post(`/admin/addproduct`, addNewProduct);
router.put(`/admin/updateproduct/:id`, updateProduct);
router.delete(`/admin/deleteproduct/:id`, deleteProduct);

export default router;
