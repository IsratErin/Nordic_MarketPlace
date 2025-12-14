import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import type { Product, NewProductInfo } from '../../src/utils/types.js';

jest.unstable_mockModule('../../prisma/client.js', () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const {
  getAllProducts,
  getProductInfo,
  getProductsByCategory,
  addNewProduct,
  updateProductInfo,
  deleteProductInfo,
} = await import('../../src/services/productService.js');
const { default: prisma } = await import('../../prisma/client.js');

//mocked functions with proper types
const mockFindMany = prisma.product.findMany as unknown as jest.MockedFunction<
  (args: any) => Promise<Product[]>
>;
const mockFindUnique = prisma.product.findUnique as unknown as jest.MockedFunction<
  (args: any) => Promise<Product | null>
>;
const mockCreate = prisma.product.create as unknown as jest.MockedFunction<
  (args: any) => Promise<Product>
>;
const mockUpdate = prisma.product.update as unknown as jest.MockedFunction<
  (args: any) => Promise<Product>
>;
const mockDelete = prisma.product.delete as unknown as jest.MockedFunction<
  (args: any) => Promise<void>
>;

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Mobile Phone',
          description: 'black mobile phone',
          price: 100,
          stock: 10,
          category: {
            id: 1,
            name: 'Electronics',
          },
        },
        {
          id: 2,
          name: 'Laptop',
          description: 'Asus laptop',
          price: 200,
          stock: 20,
          category: {
            id: 2,
            name: 'Electronics',
          },
        },
      ];
      mockFindMany.mockResolvedValue(mockProducts);

      const result = await getAllProducts();
      expect(result).toEqual(mockProducts);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductInfo', () => {
    it('should return product info when product exists', async () => {
      const mockProduct: Product = {
        id: 1,
        name: 'Lipstick',
        description: 'Red lipstick',
        price: 100,
        stock: 10,
        category: {
          id: 1,
          name: 'Cosmetics',
        },
      };
      mockFindUnique.mockResolvedValue(mockProduct);

      const result = await getProductInfo(1);
      expect(result).toEqual(mockProduct);
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 }, select: expect.any(Object) });
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Washing Machine',
          description: 'Bosch washing machine',
          price: 100,
          stock: 10,
          category: {
            id: 1,
            name: 'Home Appliances',
          },
        },
      ];
      mockFindMany.mockResolvedValue(mockProducts);

      const result = await getProductsByCategory(1);
      expect(result).toEqual(mockProducts);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        select: expect.any(Object),
      });
    });
  });

  describe('addNewProduct', () => {
    it('should add a new product', async () => {
      const newProduct: NewProductInfo = {
        name: 'Scarf ',
        description: 'Warm woolen scarf',
        price: 100,
        stock: 10,
        categoryId: 1,
      };
      const mockProduct: Product = {
        id: 1,
        ...newProduct,
        category: { id: 1, name: 'Clothing' },
      };
      mockCreate.mockResolvedValue(mockProduct);

      const result = await addNewProduct(newProduct);
      expect(result).toEqual(mockProduct);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({ data: newProduct });
    });
  });

  describe('updateProductInfo', () => {
    it('should update product info', async () => {
      const updateData: NewProductInfo = {
        name: ' Scarf (Updated Product)',
        description: 'warm woolen scarf (Updated description)',
        price: 150,
        stock: 5,
        categoryId: 1,
      };
      const mockUpdatedProduct: Product = {
        id: 1,
        ...updateData,
        category: { id: 1, name: 'Clothing' },
      };
      mockUpdate.mockResolvedValue(mockUpdatedProduct);

      const result = await updateProductInfo(1, updateData);
      expect(result).toEqual(mockUpdatedProduct);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({ where: { id: 1 }, data: updateData });
    });
  });

  describe('deleteProductInfo', () => {
    it('should delete product info', async () => {
      mockDelete.mockResolvedValue();

      await deleteProductInfo(1);
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
