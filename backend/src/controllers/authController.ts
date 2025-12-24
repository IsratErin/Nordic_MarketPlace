import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../utils/validators.js';
import * as authService from '../services/authService.js';
import logger from '../logger.js';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated_data = registerSchema.parse(req.body);
    const user = await authService.registerUser(validated_data);
    logger.info(`New user registered: ${user.email} (ID: ${user.id})`);
    res.status(201).json({ registeredUser: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated_data = loginSchema.parse(req.body);
    const data = {
      email: validated_data.email,
      password: validated_data.password,
    };
    const { user, accessToken, refreshToken } = await authService.loginUser(data);
    logger.info(`User logged in: ${user.email} (ID: ${user.id})`);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .json({ user: user, accessToken: accessToken });
  } catch (err) {
    next(err);
  }
};

export { register, login };
