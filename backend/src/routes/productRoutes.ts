import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { Role } from '../utils/types.js';
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
router.post(`/admin/addproduct`, authenticate, authorize(Role.ADMIN), addNewProduct);
router.patch(`/admin/updateproduct/:id`, authenticate, authorize(Role.ADMIN), updateProduct); // Changed to PATCH ,check unit tests failure later
router.delete(`/admin/deleteproduct/:id`, authenticate, authorize(Role.ADMIN), deleteProduct);

export default router;
