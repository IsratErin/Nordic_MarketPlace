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

export { createNewOrder };
