import prisma from '../../prisma/client.js';
import { handlePrismaError } from '../utils/prismaError.js';

const createOrder = async (userId: number, productIds: number[]) => {
  try {
    // Fetch product prices
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: product.price,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};

const getOrderInfo = async (orderId: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });
    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};

const getUserOrders = async (userId: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, user: true },
    });
    return orders;
  } catch (err) {
    handlePrismaError(err);
  }
};

type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED';
const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, user: true },
    });
    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};
const deleteOrder = async (orderId: number) => {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
  } catch (err) {
    handlePrismaError(err);
  }
};

export { createOrder, getOrderInfo, getUserOrders, updateOrderStatus, deleteOrder };
