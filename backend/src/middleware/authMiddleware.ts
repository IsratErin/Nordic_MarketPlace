import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayloadType } from '../utils/jwt.js';
import logger from '../logger.js';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadType;
    }
  }
}

// Middleware to authenticate requests using JWT
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorized if no auth header or token
  const token = authHeader.split(' ')[1];
  logger.info(`Authenticating token: ${token}`);
  try {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      logger.error('JWT access secret not defined in environment variables');
      return res.sendStatus(500).json({ message: 'Internal server error' });
    }
    // Verify token and attach payload to request
    const decoded = jwt.verify(token as string, jwtSecret) as unknown as JwtPayloadType;
    req.user = decoded; // decoded payload (e.g., { userId: 42, role: 'USER' })
    logger.info(`Authenticated user ID: ${req.user.userId}, Role: ${req.user.role}`);
    next();
  } catch {
    logger.error('Failed to authenticate token');
    res.sendStatus(403);
  }
};

export { authenticate };
