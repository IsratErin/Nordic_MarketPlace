import { z } from 'zod';
import { userSchema, newProductSchema, productSchema } from './validators.js';

export type User = z.infer<typeof userSchema>;
export type NewProductInfo = z.infer<typeof newProductSchema>;
export type Product = z.infer<typeof productSchema>;
