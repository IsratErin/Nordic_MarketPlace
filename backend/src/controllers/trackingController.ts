import * as trackingService from '../services/trackingService.js';
import logger from '../logger.js';
import {} from '../utils/validators.js';
import type { Request, Response, NextFunction } from 'express';

// get tracking data for a specific order
const getOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const statusInfo = await trackingService.getStatus(orderId);
    logger.info(`Fetched tracking status for Order ID: ${orderId}`);
    res.json({ statusInfo: statusInfo });
  } catch (err) {
    next(err);
  }
};
// update tracking status for a specific order (admin only or if implemented then courier company only)
const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = Number(req.params.orderId);
    const status = req.body.status;
    const updatedStatus = await trackingService.updateStatus(orderId, status);
    logger.info(`Updated tracking status for Order ID: ${orderId} to ${status}`);
    res.json({ updatedStatus: updatedStatus });
  } catch (err) {
    next(err);
  }
};

export { getOrderStatus, updateOrderStatus };
