//Prisma + business logic for user-related operations
import prisma from "../../prisma/client.js";
import { ApiError } from "../utils/apiError.js";

// Fetch a user by their ID
const getUser = async (userId: number) => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (err) {
    throw ApiError.internal("Database error");
  }
};

export { getUser };
