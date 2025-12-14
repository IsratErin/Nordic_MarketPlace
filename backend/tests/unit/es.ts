import { describe, expect, jest, afterEach, it } from '@jest/globals';

// -------------------------
// MOCKS
// -------------------------

// Mock helper functions
jest.mock('../../src/utils/types.js', () => ({
  __esModule: true,
  removeUndefined: jest.fn(),
}));

jest.mock('../../src/utils/prismaError.js', () => ({
  __esModule: true,
  handlePrismaError: jest.fn(),
}));

// IMPORT AFTER MOCKS
import prisma from '../../prisma/client.js';
import { getUser, updateUser, allUsers } from '../../src/services/userService.js';
import { removeUndefined } from '../../src/utils/types.js';
import { handlePrismaError } from '../../src/utils/prismaError.js';
import { ApiError } from '../../src/utils/apiError.js';

// -------------------------
// MANUAL MOCKING FOR ESM PRISMA (TypeScript-compatible)
// -------------------------

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

// Assign Jest mocks to Prisma methods manually (cast as any to avoid TS errors)
(mockedPrisma.user.findUnique as any) = jest.fn();
(mockedPrisma.user.update as any) = jest.fn();
(mockedPrisma.user.findMany as any) = jest.fn();

// -------------------------
// TESTS
// -------------------------

describe('userService', () => {
  afterEach(() => {
    // Ensures no test affects another test
    jest.clearAllMocks();
  });

  // =====================
  // getUser
  // =====================
  describe('getUser', () => {
    it('should return user when user exists', async () => {
      // Arrange: fake user returned by Prisma
      const fakeUser = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        address: 'Earth',
        role: 'USER',
        createdAt: new Date(),
      };

      (mockedPrisma.user.findUnique as any).mockResolvedValue(fakeUser as any);

      // Act
      const result = await getUser(1);

      // Assert
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
      expect(result).toEqual(fakeUser);
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      (mockedPrisma.user.findUnique as any).mockResolvedValue(null);

      // Act
      const result = await getUser(999);

      // Assert
      expect(result).toBeNull();
    });

    it('should call handlePrismaError when Prisma throws', async () => {
      // Arrange
      const prismaError = new Error('DB error');
      (mockedPrisma.user.findUnique as any).mockRejectedValue(prismaError);

      // Act + Assert
      await expect(getUser(1)).rejects.toThrow();
      expect(handlePrismaError).toHaveBeenCalledWith(prismaError);
    });
  });

  // =====================
  // You can add updateUser and allUsers tests here similarly
  // =====================
});
