//Prisma + business logic for user-related operations
import prisma from "../../prisma/client.js";

// Fetch a user by their ID
const getUser = async (userId: number) => {
  if (isNaN(userId)) {
    throw new Error("Invalid user ID");
  }
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export { getUser };
