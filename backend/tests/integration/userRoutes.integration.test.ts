import app from '../../src/app.js';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('User Routes Integration Tests', () => {
  beforeAll(async () => {
    // Seed the database with test data if necessary
    await prisma.user.createMany({
      data: [
        {
          name: 'test user 1',
          email: 'testuser1@gmail.com',
          password: 'password1',
          address: '123 Test St',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'test user 2',
          email: 'testuser2@gmail.com',
          password: 'password2',
          address: '456 Test Ave',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
  });

  afterAll(async () => {
    // Clean up the database after tests

    await prisma.$disconnect();
  });

  it('GET /allUsers - should return all users', async () => {
    const response = await request(app).get('/users/allUsers');
    //expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        users: expect.any(Array),
      }),
    ); // {users: expect.any(Array)});
  });
});
