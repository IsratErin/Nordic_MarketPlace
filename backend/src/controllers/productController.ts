import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/productService.js';
import logger from '../logger.js';
import { productSchema } from '../utils/validators.js';

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await userService.getAllProducts();
    const validatedProducts = products.map((product) => productSchema.parse(product));
    logger.info(`All products retrieved successfully.`);
    res.json({ products: validatedProducts });
  } catch (err) {
    next(err);
  }
};

const getProductInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    const productInfo = await userService.getProductInfo(productId);
    const validatedProduct = productSchema.parse(productInfo);
    logger.info(
      `Product info for ID : ${productId}, Name: ${validatedProduct.name.toUpperCase()} retrieved successfully.`,
    );
    res.json({ product: validatedProduct });
  } catch (err) {
    next(err);
  }
};

export { getAllProducts, getProductInfo };
