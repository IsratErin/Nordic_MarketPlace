import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
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
router.post(`/admin/addproduct`, authenticate, authorize('ADMIN'), addNewProduct);
router.patch(`/admin/updateproduct/:id`, authenticate, authorize('ADMIN'), updateProduct); // Changed to PATCH ,check unit tests failure later
router.delete(`/admin/deleteproduct/:id`, authenticate, authorize('ADMIN'), deleteProduct);

export default router;
