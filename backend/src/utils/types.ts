import { z } from 'zod';
import {
  userSchema,
  newProductSchema,
  updateProductSchema,
  productSchema,
  updateUserSchema,
  orderSchema,
  registerSchema,
  loginSchema,
} from './validators.js';

export type User = z.infer<typeof userSchema>;
export type UpdateUserInfo = z.infer<typeof updateUserSchema>;
export type NewProductInfo = z.infer<typeof newProductSchema>;
export type Product = z.infer<typeof productSchema>;
export type Order = z.infer<typeof orderSchema>;
export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
export type UpdateProductInfo = z.infer<typeof updateProductSchema>;

// Utility type to remove: undefined properties from an object
export function removeUndefined<T extends Record<string, unknown>>(
  obj: T,
): Record<string, NonNullable<unknown>> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as Record<string, NonNullable<unknown>>;
}
