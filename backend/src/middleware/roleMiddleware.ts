import type { Role } from '../utils/types.js';
import type { Request, Response, NextFunction } from 'express';

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(401);

    if (!allowedRoles.includes(req.user.role)) {
      return res.sendStatus(403);
    }

    next();
  };
