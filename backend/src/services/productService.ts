import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { Prisma } from '@prisma/client';

type newProductInfo = {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description?: string | null;
};

// Helper to handle Prisma errors inside try/catch
export const handlePrismaError = (err: unknown) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        // Including the conflicting field in meta
        throw ApiError.badRequest('Unique constraint violation', { target: err.meta?.target });
      case 'P2025':
        throw ApiError.notFound('Record not found');
      default:
        throw ApiError.internal(`Prisma error: ${err.message}`, { code: err.code, meta: err.meta });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    throw ApiError.badRequest(`Validation error: ${err.message}`);
  }

  console.error('Unexpected error:', err);
  throw ApiError.internal('Database error');
};

const getAllProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
      },
    });
    return products;
  } catch (err) {
    handlePrismaError(err);
  }
};

const getProductInfo = async (productId: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
      },
    });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }
    return product;
  } catch (err) {
    handlePrismaError(err);
  }
};

const getProductsByCategory = async (catId: number) => {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: catId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
      },
    });
    return products;
  } catch (err) {
    handlePrismaError(err);
  }
};

const addNewProduct = async (productInfo: newProductInfo) => {
  try {
    const newProduct = await prisma.product.create({
      data: productInfo,
    });
    return newProduct;
  } catch (err) {
    handlePrismaError(err);
  }
};

const updateProductInfo = async (productId: number, updateData: newProductInfo) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
    return updatedProduct;
  } catch (err) {
    handlePrismaError(err);
  }
};

const deleteProductInfo = async (productId: number) => {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (err) {
    handlePrismaError(err);
  }
};
export {
  getAllProducts,
  getProductInfo,
  getProductsByCategory,
  addNewProduct,
  updateProductInfo,
  deleteProductInfo,
};
