import { Prisma } from '@prisma/client';
import { ApiError } from './apiError.js';

export const handlePrismaError = (err: unknown): never => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw ApiError.badRequest('Unique constraint violation', { target: err.meta?.target });
      case 'P2025':
        throw ApiError.notFound('Record not found');
      default:
        throw ApiError.internal(`Prisma error: ${err.message}`, { code: err.code, meta: err.meta });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    throw ApiError.badRequest(`Validation error: ${err.message}`);
  }

  console.error('Unexpected error:', err);
  throw ApiError.internal('Database error');
};
