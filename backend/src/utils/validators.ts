import { z } from 'zod';

const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER', 'GUEST']),
  address: z.string().max(255).optional(),
  // Timestamps
});

export { userSchema };
