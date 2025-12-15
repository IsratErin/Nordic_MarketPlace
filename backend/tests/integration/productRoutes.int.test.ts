import prisma from '../../prisma/client.js';
import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ca } from 'zod/locales';
import { create } from 'domain';

describe('Product Routes Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Seed test categories and products
    const category = await prisma.category.create({
      data: {
        name: 'Electronics',
      },
    });

    await prisma.product.createMany({
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
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

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
    const products = await prisma.product.findMany();
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
    //console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product not found',
        status: 'fail',
      }),
    );
  });

  it('POST /products/admin/addproduct - should add a new product', async () => {
    const category = await prisma.category.findFirst({ where: { name: 'Electronics' } });
    const newProduct = {
      name: 'Tablet',
      description: 'A lightweight tablet',
      price: 499.99,
      stock: 15,
      categoryId: category?.id,
    };

    const response = await request(app).post('/products/admin/addproduct').send(newProduct);

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
    const addedProduct = await prisma.product.findUnique({
      where: { id: response.body.newProduct.id },
    });
    expect(addedProduct).not.toBeNull();
  });

  it('PATCH /products/admin/updateproduct/:id - should update a product by ID', async () => {
    const product = await prisma.product.findFirst({ where: { name: 'Laptop' } });
    const productId = product?.id;
    const category = await prisma.category.findFirst({ where: { name: 'Electronics' } });
    const categoryId = category?.id;
    console.log('Updating product with ID:', productId);
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

    console.log('Update response body:', response.body);

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

  it('DELETE /products/admin/deleteproduct/:id - should delete a product by ID', async () => {
    const products = await prisma.product.findMany();
    const productId = products[0]?.id;

    const response = await request(app).delete(`/products/admin/deleteproduct/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product deleted successfully',
      }),
    );
  });
});
