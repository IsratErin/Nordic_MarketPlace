import prisma from '../prisma/client.js';
import { ApiError } from '../utils/apiError.js';
import { handlePrismaError } from '../utils/prismaError.js';
import type { Order } from '../utils/types.js';

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

const getOrderInfo = async (orderId: number): Promise<Order | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });
    if (!order) {
      throw ApiError.notFound('Order not found');
    }
    return order;
  } catch (err) {
    handlePrismaError(err);
    throw err;
  }
};

const getUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true, user: true },
    });
    return orders;
  } catch (err) {
    handlePrismaError(err);
    throw err;
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

const admingetOrderInfo = async (orderId: number) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true }, // limited user info excluding sensitive data like password, orders etc
        },
      },
    });
    return order;
  } catch (err) {
    handlePrismaError(err);
  }
};

export {
  createOrder,
  getOrderInfo,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  admingetOrderInfo,
};
