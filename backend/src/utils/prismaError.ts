import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ApiError } from './apiError.js';

export const handlePrismaError = (err: unknown): never => {
  // Domain errors must pass through untouched and go through the error middleware as ApiErrors
  if (err instanceof ApiError) {
    throw err;
  }

  // Known Prisma request errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw ApiError.badRequest('Unique constraint violation', {
          target: err.meta?.target,
        });

      case 'P2025':
        throw ApiError.notFound('Product not found');

      default:
        throw ApiError.internal('Prisma error', {
          code: err.code,
          meta: err.meta,
        });
    }
  }

  // Prisma validation errors
  if (err instanceof PrismaClientValidationError) {
    throw ApiError.badRequest('Database validation error', {
      message: err.message,
    });
  }

  //Unknown error
  throw err;
};
