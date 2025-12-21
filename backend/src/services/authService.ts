import prisma from '../../prisma/client.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { handlePrismaError } from '../utils/prismaError.js';
import { ApiError } from '../utils/apiError.js';
import type { RegisterUserInput, LoginUserInput } from '../utils/types.js';

interface AuthResult {
  user: {
    id: number;
    email: string;
    name: string | null;
    address: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

// Registers a new user
const registerUser = async (data: RegisterUserInput): Promise<AuthResult['user']> => {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        name: data.name,
        address: data.address,
        role: data.role ?? 'USER',
      },
    });
    const { password: _, ...safeUser } = user;

    return safeUser;
  } catch (err) {
    handlePrismaError(err);
    throw err;
  }
};

// Logs in a user and returns auth tokens along with user info without password.
const loginUser = async (data: LoginUserInput): Promise<AuthResult> => {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.password))) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = signRefreshToken({ userId: user.id });
    const { password: _, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  } catch (err) {
    handlePrismaError(err);
    throw err;
  }
};

export { registerUser, loginUser };
