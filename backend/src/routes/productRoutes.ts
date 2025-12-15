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
router.patch(`/admin/updateproduct/:id`, updateProduct); // Changed to PATCH ,check unit tests failure later
router.delete(`/admin/deleteproduct/:id`, deleteProduct);

export default router;
