import prismaTestClient from '../prismaTestClient.js';
import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Order Routes (Integration)', () => {
  let userId: number;
  let productIds: number[];

  beforeAll(async () => {
    await prismaTestClient.$connect();
    await prismaTestClient.orderItem.deleteMany();
    await prismaTestClient.order.deleteMany();
    await prismaTestClient.product.deleteMany();
    await prismaTestClient.category.deleteMany();
    await prismaTestClient.user.deleteMany();

    // Seed test data
    const category = await prismaTestClient.category.create({
      data: {
        name: 'Electronics',
      },
    });

    // Create products
    await prismaTestClient.product.createMany({
      data: [
        {
          name: 'Laptop ',
          description: 'High-performance laptop',
          price: 100,
          stock: 10,
          categoryId: category.id,
        },
        {
          name: 'Mobile Phone',
          description: 'Samsung mobile phone',
          price: 200,
          stock: 10,
          categoryId: category.id,
        },
      ],
    });

    // Fetch the created products
    const productList = await prismaTestClient.product.findMany();
    productIds = productList.map((p) => p.id);

    // Create user
    const user = await prismaTestClient.user.create({
      data: {
        name: 'Inayra',
        email: 'inayra@example.com',
        password: 'password',
        address: 'Stockholm',
        role: 'USER',
      },
    });
    userId = user.id;

    // Create initial order
    if (!productList[0] || !productList[1]) {
      throw new Error('Not enough products to create initial order');
    }
    await prismaTestClient.order.create({
      data: {
        userId: user.id,
        items: {
          create: [
            { productId: productList[0].id, quantity: 1, price: 100 },
            { productId: productList[1].id, quantity: 1, price: 200 },
          ],
        },
      },
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

  it('POST /orders/user/create - should create a new order', async () => {
    const newOrderData = {
      userId: userId,
      productIds: productIds,
    };

    const response = await request(app).post('/orders/user/create').send(newOrderData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        order: expect.objectContaining({
          id: expect.any(Number),
          userId: userId,
          status: 'PLACED',
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(Number),
              quantity: 1,
              price: expect.any(Number),
            }),
          ]),
        }),
      }),
    );

    const addedOrder = await prismaTestClient.order.findUnique({
      where: { id: response.body.order.id },
    });
    expect(addedOrder).not.toBeNull();
  });

  it('GET /orders/user/info/:orderId - should return order info', async () => {
    const orders = await prismaTestClient.order.findMany();
    const orderId = orders[0]?.id;

    const response = await request(app).get(`/orders/user/info/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        orderInfo: expect.objectContaining({
          id: orderId,
          userId: expect.any(Number),
          status: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(Number),
              quantity: expect.any(Number),
              price: expect.any(Number),
            }),
          ]),
        }),
      }),
    );
  });

  it('GET /orders/user/:userId - should return all orders for a user', async () => {
    const response = await request(app).get(`/orders/user/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        userOrders: expect.arrayContaining([
          expect.objectContaining({
            orderId: expect.any(Number),
            userId: userId,
            status: expect.any(String),
            items: expect.arrayContaining([
              expect.objectContaining({
                productId: expect.any(Number),
                quantity: expect.any(Number),
                price: expect.any(Number),
              }),
            ]),
          }),
        ]),
      }),
    );
  });

  it('PATCH /orders/admin/update-status/:orderId - should update order status', async () => {
    const orders = await prismaTestClient.order.findMany();
    const orderId = orders[0]?.id;

    const updateData = {
      status: 'SHIPPED',
    };

    const response = await request(app)
      .patch(`/orders/admin/update-status/${orderId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        updatedOrder: expect.objectContaining({
          id: orderId,
          status: 'SHIPPED',
        }),
      }),
    );
  });

  it('GET /orders/admin/:orderId - should return order info for admin', async () => {
    const orders = await prismaTestClient.order.findMany();
    const orderId = orders[0]?.id;

    const response = await request(app).get(`/orders/admin/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        orderInfo: expect.objectContaining({
          id: orderId,
          userId: expect.any(Number),
          status: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: expect.any(Number),
              quantity: expect.any(Number),
              price: expect.any(Number),
            }),
          ]),
          user: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
          }),
        }),
      }),
    );
  });

  it('DELETE /orders/user/delete/:orderId - should delete an order', async () => {
    const orders = await prismaTestClient.order.findMany();
    const orderId = orders[0]?.id;

    const response = await request(app).delete(`/orders/user/delete/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('deleted successfully'),
      }),
    );
  });

  it('GET /orders/user/info/:orderId - should return 404 for non-existing order', async () => {
    const response = await request(app).get('/orders/user/info/99999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'fail',
        message: expect.any(String),
      }),
    );
  });
});
