import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import type { User } from '../../src/utils/types.js';

jest.unstable_mockModule('../../prisma/client.js', () => ({
  __esModule: true, // for default export
  default: {
    user: {
      findUnique: jest.fn(), // runtime mock
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

/**
 * Dynamic imports after mocking
 * - Ensures the imported Prisma client and userService is the mocked version
 */
const { getUser } = await import('../../src/services/userService.js');
const { default: prisma } = await import('../../prisma/client.js');

// Type assertion for better type safety in tests
const mockFindUnique = prisma.user.findUnique as unknown as jest.MockedFunction<
  (args: any) => Promise<User | null>
>;

describe('userService - getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return user when user exists', async () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      role: 'USER',
      //createdAt: new Date('2025-01-01'),
    };
    mockFindUnique.mockResolvedValue(mockUser);
    const result = await getUser(1);
    expect(result).toEqual(mockUser);
    expect(mockFindUnique).toHaveBeenCalledTimes(1);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        //createdAt: true,
      },
    });
  });

  it('should return null when user does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await getUser(999);
    expect(result).toBeNull();
    expect(mockFindUnique).toHaveBeenCalledTimes(1);
  });
});
