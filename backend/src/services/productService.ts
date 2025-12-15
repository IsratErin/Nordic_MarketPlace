import { error } from 'console';
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { handlePrismaError } from '../utils/prismaError.js';
import type { Product, NewProductInfo } from '../utils/types.js';

/*type newProductInfo = {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description?: string | null;
};*/

const getAllProducts = async (): Promise<Product[]> => {
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
    throw new Error('Unreachable'); // added for type safety for now
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
      throw ApiError.notFound(`Product not found`);
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
    if (products.length === 0) {
      throw ApiError.notFound(`Product not found`);
    }
    return products;
  } catch (err) {
    handlePrismaError(err);
  }
};

const addNewProduct = async (productInfo: NewProductInfo) => {
  try {
    const newProduct = await prisma.product.create({
      data: productInfo,
    });
    return newProduct;
  } catch (err) {
    handlePrismaError(err);
  }
};

const updateProductInfo = async (productId: number, updateData: NewProductInfo) => {
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
