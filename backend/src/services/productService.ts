import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';

const getAllProducts = async () => {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
      },
    });
  } catch (err) {
    throw ApiError.internal('Database error');
  }
};
export { getAllProducts };
