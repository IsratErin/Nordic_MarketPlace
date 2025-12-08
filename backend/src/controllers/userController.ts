import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import logger from '../logger.js';
import { ApiError } from '../utils/apiError.js';
import { userSchema } from '../utils/validators.js';

//GET /users/allUsers
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for fetching all users logic
    const users = await userService.allUsers();
    logger.info(`All users retrieved successfully.`);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return next(ApiError.badRequest('Invalid user ID'));
    }

    const user = await userService.getUser(userId);

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }
    const validatedUser = userSchema.parse(user);
    logger.info(`User ${userId} retrieved successfully.`);
    res.json({ user: validatedUser });
  } catch (err) {
    next(err);
  }
};
