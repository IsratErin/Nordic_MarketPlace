import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';

type newProductInfo = {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description?: string | null;
};

//type updateProductInfo = Partial<newProductInfo>;

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
    throw ApiError.internal('Database error');
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
    throw ApiError.internal('Database error');
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
    throw ApiError.internal('Database error');
  }
};

const addNewProduct = async (productInfo: newProductInfo) => {
  try {
    const newProduct = await prisma.product.create({
      data: productInfo,
    });
    return newProduct;
  } catch (err) {
    throw ApiError.internal(`Database error`);
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
    throw ApiError.internal('Database error');
  }
};

const deleteProductInfo = async (productId: number) => {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      // Prisma error code for "Record to delete does not exist."
      throw ApiError.notFound('Product not found');
    }
    throw ApiError.internal('Database error');
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
