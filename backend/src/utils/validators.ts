import { z } from 'zod';

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER', 'GUEST']),
  address: z.string().max(255).optional(),
  // Timestamps
});

const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  category: z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100),
  }),
  // Timestamps
});
const newProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z
    .string()
    .max(1000)
    .optional()
    .transform((v) => v ?? null),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int().positive(),
});

export { userSchema, productSchema, newProductSchema };
