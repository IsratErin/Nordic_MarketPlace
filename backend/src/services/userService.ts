//Prisma + business logic for user-related operations
import prisma from '../../prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import type { User, UpdateUserInfo } from '../utils/types.js';
import { removeUndefined } from '../utils/types.js';
import { handlePrismaError } from '../utils/prismaError.js';

// Fetch a user by their ID
const getUser = async (userId: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
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
    return user;
  } catch (err) {
    handlePrismaError(err);
    throw new Error('Unreachable'); // added for type safety for now
  }
};

const updateUser = async (userId: number, data: UpdateUserInfo): Promise<User> => {
  try {
    const dataToUpdate = removeUndefined(data); // Removes undefined fields from the data provided for update
    if (Object.keys(dataToUpdate).length === 0) {
      throw ApiError.badRequest('No fields provided to update');
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
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
    return updatedUser;
  } catch (err) {
    handlePrismaError(err);
    throw new Error('Unreachable'); // added for type safety for now
  }
};

const allUsers = async (): Promise<User[]> => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
    return allUsers;
  } catch (err) {
    handlePrismaError(err);
    throw new Error('Unreachable'); // added for type safety for now
  }
};

export { getUser, allUsers, updateUser };
