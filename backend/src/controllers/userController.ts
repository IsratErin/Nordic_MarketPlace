//handles request/response
import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";

// GET /users/:id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await userService.getUser(userId); // Call to service layer to get user from DB
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
