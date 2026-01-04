import prismaTestClient from '../prismaTestClient.js';
import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { signAccessToken } from '../../src/utils/jwt.js';
import { hashPassword } from '../../src/utils/password.js';

describe('Product Routes Integration Tests', () => {
  let adminToken: string;
  let adminUserId: number;

  beforeAll(async () => {
    await prismaTestClient.$connect();
    await prismaTestClient.orderItem.deleteMany();
    await prismaTestClient.order.deleteMany();
    await prismaTestClient.product.deleteMany();
    await prismaTestClient.category.deleteMany();
    await prismaTestClient.user.deleteMany();

    // admin user for testing authentication and protected routes
    const hashedPassword = await hashPassword('adminpassword');
    const adminUser = await prismaTestClient.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        address: 'Stockholm',
        role: 'ADMIN',
      },
    });
    adminUserId = adminUser.id;

    // JWT token for admin
    adminToken = signAccessToken({
      userId: adminUser.id,
      role: adminUser.role,
    });

    // Seed test categories and products
    const category = await prismaTestClient.category.create({
      data: {
        name: 'Electronics',
      },
    });

    await prismaTestClient.product.createMany({
      data: [
        {
          name: 'Laptop',
          description: 'A high-performance laptop',
          price: 1200.99,
          stock: 10,
          categoryId: category.id,
        },
        {
          name: 'Smartphone',
          description: 'A powerful smartphone',
          price: 799.99,
          stock: 20,
          categoryId: category.id,
        },
      ],
    });
  });

  afterAll(async () => {
    await prismaTestClient.orderItem.deleteMany();
    await prismaTestClient.order.deleteMany();
    await prismaTestClient.product.deleteMany();
    await prismaTestClient.category.deleteMany();
    await prismaTestClient.user.deleteMany();
    await prismaTestClient.$disconnect();
  });

  // Public routes (no authentication required)
  it('GET /products - should return all products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Laptop',
            description: 'A high-performance laptop',
            price: 1200.99,
            stock: 10,
            category: expect.objectContaining({
              id: expect.any(Number),
              name: 'Electronics',
            }),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Smartphone',
            description: 'A powerful smartphone',
            price: 799.99,
            stock: 20,
            category: expect.objectContaining({
              id: expect.any(Number),
              name: 'Electronics',
            }),
          }),
        ]),
      }),
    );
  });

  it('GET /products/:id - should return product details by ID', async () => {
    const products = await prismaTestClient.product.findMany();
    const productId = products[0]?.id;

    const response = await request(app).get(`/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        product: expect.objectContaining({
          id: productId,
          name: 'Laptop',
          description: 'A high-performance laptop',
          price: 1200.99,
          stock: 10,
          category: expect.objectContaining({
            id: expect.any(Number),
            name: 'Electronics',
          }),
        }),
      }),
    );
  });

  it('GET /products/:id - should return 404 for non-existent product', async () => {
    const response = await request(app).get('/products/99999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product not found',
        status: 'fail',
      }),
    );
  });

  // Admin routes
  it('POST /products/admin/addproduct - should return 401 without token', async () => {
    const category = await prismaTestClient.category.findFirst({ where: { name: 'Electronics' } });
    const newProduct = {
      name: 'Tablet',
      description: 'A lightweight tablet',
      price: 499.99,
      stock: 15,
      categoryId: category?.id,
    };

    const response = await request(app).post('/products/admin/addproduct').send(newProduct);

    expect(response.status).toBe(401);
  });

  it('POST /products/admin/addproduct - should add a new product with admin token', async () => {
    const category = await prismaTestClient.category.findFirst({ where: { name: 'Electronics' } });
    const newProduct = {
      name: 'Tablet',
      description: 'A lightweight tablet',
      price: 499.99,
      stock: 15,
      categoryId: category?.id,
    };

    const response = await request(app)
      .post('/products/admin/addproduct')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProduct);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        newProduct: expect.objectContaining({
          id: expect.any(Number),
          name: 'Tablet',
          description: 'A lightweight tablet',
          price: 499.99,
          stock: 15,
        }),
      }),
    );

    // Verify the product was added
    const addedProduct = await prismaTestClient.product.findUnique({
      where: { id: response.body.newProduct.id },
    });
    expect(addedProduct).not.toBeNull();
  });

  it('PATCH /products/admin/updateproduct/:id - should return 401 without token', async () => {
    const product = await prismaTestClient.product.findFirst({ where: { name: 'Laptop' } });
    const productId = product?.id;
    const category = await prismaTestClient.category.findFirst({ where: { name: 'Electronics' } });
    const categoryId = category?.id;

    const updateData = {
      id: productId,
      name: 'Updated Laptop',
      price: 1200.99,
      stock: 10,
      description: 'A high-performance laptop',
      categoryId: categoryId,
      createdAt: product?.createdAt,
      updatedAt: new Date(),
    };

    const response = await request(app)
      .patch(`/products/admin/updateproduct/${productId}`)
      .send(updateData);

    expect(response.status).toBe(401);
  });

  it('PATCH /products/admin/updateproduct/:id - should update a product by ID with admin token', async () => {
    const product = await prismaTestClient.product.findFirst({ where: { name: 'Laptop' } });
    const productId = product?.id;
    const category = await prismaTestClient.category.findFirst({ where: { name: 'Electronics' } });
    const categoryId = category?.id;

    const updateData = {
      id: productId,
      name: 'Updated Laptop',
      price: 1200.99,
      stock: 10,
      description: 'A high-performance laptop',
      categoryId: categoryId,
      createdAt: product?.createdAt,
      updatedAt: new Date(),
    };

    const response = await request(app)
      .patch(`/products/admin/updateproduct/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        updatedProduct: expect.objectContaining({
          id: productId,
          name: 'Updated Laptop',
          description: 'A high-performance laptop',
          price: 1200.99,
          stock: 10,
          categoryId: categoryId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      }),
    );
  });

  it('DELETE /products/admin/deleteproduct/:id - should return 401 without token', async () => {
    const products = await prismaTestClient.product.findMany();
    const productId = products[0]?.id;

    const response = await request(app).delete(`/products/admin/deleteproduct/${productId}`);

    expect(response.status).toBe(401);
  });

  it('DELETE /products/admin/deleteproduct/:id - should delete a product by ID with admin token', async () => {
    const products = await prismaTestClient.product.findMany();
    const productId = products[0]?.id;

    const response = await request(app)
      .delete(`/products/admin/deleteproduct/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product deleted successfully',
      }),
    );

    // Verifying the product was deleted
    const deletedProduct = await prismaTestClient.product.findUnique({
      where: { id: productId },
    });
    expect(deletedProduct).toBeNull();
  });
});
