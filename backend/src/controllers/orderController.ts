import * as orderService from '../services/orderService.js';
import logger from '../logger.js';
import {} from '../utils/validators.js';
import type { Request, Response, NextFunction } from 'express';

const createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.body.userId); // In real scenarios will get this from auth middleware
    const productIds: number[] = req.body.productIds;
    const newOrder = await orderService.createOrder(userId, productIds);
    logger.info(`New order created for User ID: ${userId}, Order ID: ${newOrder?.id}`);
    res.json({ order: newOrder });
  } catch (err) {
    next(err);
  }
};
const getOrderInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await orderService.getOrderInfo(orderId);
    logger.info(`Fetched info for Order ID: ${orderId}`);
    res.json({ orderInfo: order });
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId);
    const orders = await orderService.getUserOrders(userId);
    const oerdersInfo = orders?.map((order) => ({
      orderId: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items?.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
    logger.info(`Fetched orders for User ID: ${userId}`);
    res.json({ userOrders: oerdersInfo });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const status = req.body.status;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    logger.info(`Updated status for Order ID: ${orderId} to ${status}`);
    res.json({ updatedOrder: updatedOrder });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    await orderService.deleteOrder(orderId);
    logger.info(`Deleted Order ID: ${orderId}`);
    res.json({ message: `Order: ${orderId} deleted successfully` });
  } catch (err) {
    next(err);
  }
};

export { createNewOrder, getOrderInfo, getUserOrders, updateOrderStatus, deleteOrder };
