import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: number;
  role: Role;
}

export const signAccessToken = (payload: JwtPayload) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'];

  if (!secret || !expiresIn) {
    throw new Error('JWT access env vars not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const signRefreshToken = (payload: { userId: number }) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

  if (!secret || !expiresIn) {
    throw new Error('JWT refresh env vars not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
};
