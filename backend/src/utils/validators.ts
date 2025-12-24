import { z } from 'zod';

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100).nullable(),
  email: z.string().email().max(255).min(5),
  role: z.enum(['USER', 'ADMIN']),
  address: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  // Timestamps
});
const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(255).min(5),
    address: z.string().max(255),
  })
  .partial();

const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(150),
  description: z
    .string()
    .max(1000)
    .nullable() // accepts null from database
    .optional()
    .transform((v) => v ?? null),
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
const updateProductSchema = z.object({
  name: z.string().min(2).max(150),
  description: z
    .string()
    .max(1000)
    .optional()
    .transform((v) => v ?? null),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const orderStatusEnum = z.enum(['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED']);
const orderSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  status: orderStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      orderId: z.number().int().positive(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().nonnegative(),
    }),
  ),
  user: z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100).nullable(),
    email: z.string().email().max(255).min(5),
    address: z
      .string()
      .max(255)
      .nullable()
      .optional()
      .transform((v) => v ?? null),
  }),
});

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  address: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export {
  userSchema,
  productSchema,
  newProductSchema,
  orderSchema,
  orderStatusEnum,
  orderItemSchema,
  updateUserSchema,
  registerSchema,
  loginSchema,
  updateProductSchema,
};
