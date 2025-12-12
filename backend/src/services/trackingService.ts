import prisma from '../../prisma/client.js';
import { handlePrismaError } from '../utils/prismaError.js';

// Get tracking status for a specific order
const getStatus = async (orderId: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, createdAt: true, updatedAt: true },
    });
    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};

//update tracking status for a specific order

type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED';

const updateStatus = async (orderId: number, status: OrderStatus) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};
export { getStatus, updateStatus };
