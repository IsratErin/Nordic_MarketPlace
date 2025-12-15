import prisma from '../../prisma/client.js'; // Use the shared or test-specific Prisma client
import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('User Routes Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();

    // Seed test users
    await prisma.user.createMany({
      data: [
        {
          name: 'test user 1',
          email: 'testuser1@gmail.com',
          password: 'password1',
          address: 'nacka',
          role: 'USER',
        },
        {
          name: 'test user 2',
          email: 'testuser2@gmail.com',
          password: 'password2',
          address: 'farsta',
          role: 'USER',
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('GET /users/allUsers - should return all users', async () => {
    const response = await request(app).get('/users/allUsers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: 'test user 1',
            email: 'testuser1@gmail.com',
            address: 'nacka',
            role: 'USER',
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: 'test user 2',
            email: 'testuser2@gmail.com',
            address: 'farsta',
            role: 'USER',
            createdAt: expect.any(String),
          }),
        ]),
      }),
    );
    expect(response.body.users.length).toBe(2);
  });

  it('GET /users/:id - should return a user by ID', async () => {
    const users = await prisma.user.findMany();
    const userId = users[0]?.id; // Ensure the user exists

    const response = await request(app).get(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: userId,
          name: 'test user 1',
          email: 'testuser1@gmail.com',
          address: 'nacka',
          role: 'USER',
        }),
      }),
    );
  });

  it('GET /users/:id - should return 404 for non-existent user', async () => {
    const response = await request(app).get('/users/99999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'User not found',
        status: 'fail',
      }),
    );
  });

  it('PATCH /users/:id - should update a user by ID', async () => {
    const users = await prisma.user.findMany();
    const userId = users[0]?.id; // Ensure the user exists

    const updateData = {
      name: 'Updated User Name',
      email: 'testuser1@gmail.com',
      address: 'Updated Address',
    };
    const response = await request(app).patch(`/users/${userId}`).send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        updatedUser: expect.objectContaining({
          id: userId,
          name: 'Updated User Name',
          email: 'testuser1@gmail.com',
          address: 'Updated Address',
        }),
      }),
    );
  });

  it('PATCH /users/:id - should return 404 for non-existent user', async () => {
    const updateData = { name: 'Non-existent User' };
    const response = await request(app).patch('/users/99999').send(updateData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Product not found',
        status: 'fail',
      }),
    );
  });
});
