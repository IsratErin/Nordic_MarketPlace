import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';
import logger from '../logger.js';

export type error = {
  statusCode?: number;
  message?: string;
  code?: string;
  meta?: any;
  stack?: string;
};

export const errorMiddleware = (
  err: error,
  _req: Request, // added underscore
  res: Response,
  _next: NextFunction, // added underscore to indicate unused variable
) => {
  logger.error(
    `Error: ${err.message} \n Stack: ${err.stack}\n statusCode: ${err.statusCode}\n Meta: ${JSON.stringify(err.meta)}`,
  );

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: `Zod Validation error: ${err.message}`,
      //specific path
      meta: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
      statusCode: 400,
    });
  }

  //  Custom API Error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.statusCode < 500 ? 'fail' : 'error',
      message: err.message,
      meta: err.meta,
    });
  }

  // 3. Prisma errors with code
  if (err.code && typeof err.code === 'string') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'fail',
        message: 'Unique constraint violation',
        meta: { target: err.meta?.target },
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Record not found',
        meta: err.meta || null,
      });
    }

    // Generic Prisma error fallback
    /*
    return res.status(400).json({
      status: 'fail',
      message: 'Database error',
      code: err.code,
      meta: err.meta || null,
    }); */
  }

  //authentication errors
  if (err.message === 'Unauthorized') {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  // user registration error for existing email
  if (err.message === 'Email already in use') {
    return res.status(409).json({
      status: 'fail',
      message: 'Email already in use',
    });
  }
  //other auth errors
  if (err.message === 'Invalid email or password') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }
  // unhandled errors or unknown errors
  return res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  });
};
