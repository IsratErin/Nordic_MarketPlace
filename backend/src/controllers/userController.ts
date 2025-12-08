import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";
import logger from "../logger.js";
import { ApiError } from "../utils/apiError.js";

// GET /users/:id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return next(ApiError.badRequest("Invalid user ID"));
    }

    const user = await userService.getUser(userId);

    if (!user) {
      return next(ApiError.notFound("User not found"));
    }

    logger.info(`User ${userId} retrieved successfully.`);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
