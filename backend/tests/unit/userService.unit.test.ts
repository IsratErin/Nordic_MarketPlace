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

jest.unstable_mockModule('../../src/utils/prismaError.js', () => ({
  handlePrismaError: jest.fn(),
}));

/**
 * Dynamic imports after mocking
 * - Ensures the imported Prisma client and userService is the mocked version
 */
const { getUser, updateUser, allUsers } = await import('../../src/services/userService.js');
const { default: prisma } = await import('../../prisma/client.js');
const { handlePrismaError } = await import('../../src/utils/prismaError.js');

// Type assertion for better type safety in tests
const mockFindUnique = prisma.user.findUnique as unknown as jest.MockedFunction<
  (args: any) => Promise<User | null>
>;
const mockFindMany = prisma.user.findMany as unknown as jest.MockedFunction<
  (args: any) => Promise<User[]>
>;
const mockUpdate = prisma.user.update as unknown as jest.MockedFunction<
  (args: any) => Promise<User>
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
      },
    });
  });

  it('should return null when user does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await getUser(999);
    expect(result).toBeNull();
    expect(mockFindUnique).toHaveBeenCalledTimes(1);
  });

  it('should handle prisma error when findUnique throws', async () => {
    const prismaError = new Error(`Unreachable`);
    mockFindUnique.mockRejectedValue(prismaError);

    await expect(getUser(1)).rejects.toThrow(`Unreachable`);

    expect(handlePrismaError).toHaveBeenCalledWith(prismaError);
  });
});

describe('userService - allUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return all users', async () => {
    const mockUsersAll: User[] = [
      {
        id: 1,
        name: 'israt',
        email: 'israt123@gmail.com',
        address: 'Stockholm',
        role: 'USER',
      },
      {
        id: 2,
        name: 'Alina',
        email: 'alina@example.com',
        address: 'Gothenburg',
        role: 'USER',
      },
    ];

    mockFindMany.mockResolvedValue(mockUsersAll);
    const result = await allUsers();
    expect(result).toEqual(mockUsersAll);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
    expect(mockFindMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  });
});

describe('userService - updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should update and return the user', async () => {
    const mockUpdatedUser: User = {
      id: 1,
      name: 'Jane Danne',
      email: 'jane@gmail.com',
      address: 'Kista',
      role: 'USER',
    };

    mockUpdate.mockResolvedValue(mockUpdatedUser);
    const updateData = { name: 'Jane Danne', address: 'Kista updated' };
    const result = await updateUser(1, updateData);
    expect(result).toEqual(mockUpdatedUser);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
  it('should throw error when no fields are provided to update', async () => {
    const prismaError = new Error(`Unreachable`); // unreachable for now
    await expect(updateUser(1, {})).rejects.toThrow(prismaError);

    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
