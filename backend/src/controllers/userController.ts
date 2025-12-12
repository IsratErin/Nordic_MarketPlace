import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import logger from '../logger.js';
import { ApiError } from '../utils/apiError.js';
import { userSchema, updateUserSchema } from '../utils/validators.js';

//logger.info('Logger is working in userController.ts');

//GET /users/allUsers
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
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

// PUT /users/:id

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return next(ApiError.badRequest('Invalid user ID'));
    }
    const updateData = req.body;
    const validatedUpdateData = updateUserSchema.parse(updateData);
    const updatedUser = await userService.updateUser(userId, validatedUpdateData);
    const validatedUser = userSchema.parse(updatedUser);
    logger.info(`User ${userId} updated successfully.`);
    res.json({ updatedUser: validatedUser });
  } catch (err) {
    next(err);
  }
};

export { updateUserById, getAllUsers, getUserById };
