import type { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService.js';
import logger from '../logger.js';
import { productSchema, newProductSchema } from '../utils/validators.js';
//import type { Product } from '../utils/types.js';

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts();
    const validatedProducts = (products || []).map((product) => productSchema.parse(product));
    logger.info(`All products retrieved successfully.`);
    res.json({ products: validatedProducts });
  } catch (err) {
    next(err);
  }
};

const getProductInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    const productInfo = await productService.getProductInfo(productId);
    const validatedProduct = productSchema.parse(productInfo);
    logger.info(
      `Product info for ID : ${productId}, Name: ${validatedProduct.name.toUpperCase()} retrieved successfully.`,
    );
    res.json({ product: validatedProduct });
  } catch (err) {
    next(err);
  }
};

const getAllProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const products = await productService.getProductsByCategory(categoryId);
    const validatedProducts = (products || []).map((product) => productSchema.parse(product));
    logger.info(
      `All products from Category: ${validatedProducts[0]?.category.name.toUpperCase()} retrieved successfully.`,
    );
    res.json({ productsByCategory: validatedProducts });
  } catch (err) {
    next(err);
  }
};

//admin only

const addNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProductInfo = req.body;
    const validatedProductInfo = newProductSchema.parse(newProductInfo);
    const newAddedProduct = await productService.addNewProduct(validatedProductInfo);
    logger.info(`New product added: ${validatedProductInfo.name.toUpperCase()}`);
    res.json({ newProduct: newAddedProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    const updateData = req.body;
    const validatedUpdateData = newProductSchema.parse(updateData);
    const updatedProduct = await productService.updateProductInfo(productId, validatedUpdateData);
    logger.info(`Product ID: ${productId} updated successfully.`);
    res.json({ updatedProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    await productService.deleteProductInfo(productId);
    logger.info(`Product with ID: ${productId} deleted successfully.`);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export {
  getAllProducts,
  getProductInfo,
  getAllProductsByCategory,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
