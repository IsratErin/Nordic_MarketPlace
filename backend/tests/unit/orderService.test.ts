import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import type { User, Order } from '../../src/utils/types.js';
import { tr } from 'zod/locales';

jest.unstable_mockModule('../../prisma/client.js', () => ({
  __esModule: true,
  default: {
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  },
}));

const {
  createOrder,
  getOrderInfo,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  admingetOrderInfo,
} = await import('../../src/services/orderService.js');
const { default: prisma } = await import('../../prisma/client.js');

// Mocked functions with proper types
const mockOrderCreate = prisma.order.create as unknown as jest.MockedFunction<
  (args: any) => Promise<Order>
>;
const mockOrderFindUnique = prisma.order.findUnique as unknown as jest.MockedFunction<
  (args: any) => Promise<Order | null>
>;
const mockOrderFindMany = prisma.order.findMany as unknown as jest.MockedFunction<
  (args: any) => Promise<Order[]>
>;
const mockOrderUpdate = prisma.order.update as unknown as jest.MockedFunction<
  (args: any) => Promise<Order>
>;
const mockOrderDelete = prisma.order.delete as unknown as jest.MockedFunction<
  (args: any) => Promise<void>
>;
const mockProductFindMany = prisma.product.findMany as unknown as jest.MockedFunction<
  (args: any) => Promise<any[]>
>;

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const mockProducts = [
        { id: 1, price: 100 },
        { id: 2, price: 200 },
      ];
      const mockOrder: Order = {
        id: 1,
        userId: 1,
        status: 'PLACED',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          { id: 1, orderId: 1, productId: 1, quantity: 1, price: 100 },
          { id: 2, orderId: 1, productId: 2, quantity: 1, price: 200 },
        ],
        user: { id: 1, name: 'Israt', email: 'israt@gmail.com', address: 'Nacka' },
      };
      mockProductFindMany.mockResolvedValue(mockProducts);
      mockOrderCreate.mockResolvedValue(mockOrder);

      const result = await createOrder(1, [1, 2]);
      expect(result).toEqual(mockOrder);
      expect(mockProductFindMany).toHaveBeenCalledTimes(1);
      expect(mockOrderCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrderInfo', () => {
    it('should return order info when order exists', async () => {
      const mockOrder: Order = {
        id: 1,
        userId: 1,
        status: 'PLACED',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [{ id: 1, orderId: 1, productId: 1, quantity: 1, price: 100 }],
        user: { id: 1, name: 'Israt', email: 'israt@gmail.com', address: 'Nacka' },
      };
      mockOrderFindUnique.mockResolvedValue(mockOrder);

      const result = await getOrderInfo(1);
      expect(result).toEqual(mockOrder);
      expect(mockOrderFindUnique).toHaveBeenCalledTimes(1);
      expect(mockOrderFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });

    it('should return null when order does not exist', async () => {
      mockOrderFindUnique.mockResolvedValue(null);

      const result = await getOrderInfo(999);
      expect(result).toBeNull();
      expect(mockOrderFindUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserOrders', () => {
    it('should return all orders for a user', async () => {
      const mockOrders: Order[] = [
        {
          id: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          status: 'PLACED',
          user: { id: 1, name: 'Israt', email: 'israt@gmail.com', address: 'Nacka' },
        },
        {
          id: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          status: 'SHIPPED',
          user: { id: 1, name: 'Israt', email: 'israt@gmail.com', address: 'Nacka' },
        },
      ];
      mockOrderFindMany.mockResolvedValue(mockOrders);

      const result = await getUserOrders(1);
      expect(result).toEqual(mockOrders);
      expect(mockOrderFindMany).toHaveBeenCalledTimes(1);
      expect(mockOrderFindMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: expect.any(Object),
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status', async () => {
      const mockOrder: Order = {
        id: 1,
        userId: 1,
        items: [],
        status: 'SHIPPED',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, name: 'Israt', email: 'israt@gmail.com', address: 'Nacka' },
      };
      mockOrderUpdate.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus(1, 'SHIPPED');
      expect(result).toEqual(mockOrder);
      expect(mockOrderUpdate).toHaveBeenCalledTimes(1);
      expect(mockOrderUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'SHIPPED' },
        include: expect.any(Object),
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      mockOrderDelete.mockResolvedValue();

      await deleteOrder(1);
      expect(mockOrderDelete).toHaveBeenCalledTimes(1);
      expect(mockOrderDelete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('admingetOrderInfo', () => {
    it('should return order info with limited user details', async () => {
      const mockOrder: Order = {
        id: 1,
        userId: 1,
        items: [],
        status: 'PLACED',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, name: 'Israt', email: `israt@gmail.com`, address: 'Nacka' },
      };
      mockOrderFindUnique.mockResolvedValue(mockOrder);

      const result = await admingetOrderInfo(1);
      expect(result).toEqual(mockOrder);
      expect(mockOrderFindUnique).toHaveBeenCalledTimes(1);
      expect(mockOrderFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });
    });
  });
});
