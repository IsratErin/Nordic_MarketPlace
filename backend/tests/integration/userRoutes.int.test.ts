import prisma from '../../prisma/client.js';
import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('User Routes Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: [
        {
          name: 'test user 1',
          email: 'testuser1@gmail.com',
          password: 'password1',
          address: '123 Test St',
          role: 'USER',
        },
        {
          name: 'test user 2',
          email: 'testuser2@gmail.com',
          password: 'password2',
          address: '456 Test Ave',
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
        users: expect.any(Array),
      }),
    );
  });
});
