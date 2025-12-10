//Prisma + business logic for user-related operations
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';

type userUpdateData = {
  name?: string;
  email?: string;
};

// Fetch a user by their ID
const getUser = async (userId: number) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (err) {
    throw ApiError.internal('Database error');
  }
};

const updateUser = async (userId: number, data: userUpdateData) => {
  try {
    if (Object.keys(data).length === 0) {
      throw ApiError.badRequest('No fields provided to update');
    }
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (err) {
    throw ApiError.internal('Database error');
  }
};

const allUsers = async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (err) {
    throw ApiError.internal('Database error');
  }
};

export { getUser, allUsers, updateUser };
