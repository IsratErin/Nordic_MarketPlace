import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Delete existing data to avoid duplicates
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing data deleted!');

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      { email: 'israt@example.com', password: 'password1', name: 'Israt', role: 'USER' },
      { email: 'nayeem@example.com', password: 'password2', name: 'Nayeem', role: 'USER' },
      { email: 'sophia@example.com', password: 'password3', name: 'Sophia', role: 'USER' },
      { email: 'emilie@example.com', password: 'adminpassword1', name: 'Emilie', role: 'ADMIN' },
      { email: 'admin@example.com', password: 'adminpassword2', name: 'Admin', role: 'ADMIN' },
    ],
  });

  console.log('Users seeded!');
  //categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Clothing' },
      { name: 'Home & Kitchen' },
      { name: 'Sports & Outdoors' },
    ],
  });

  console.log('Categories seeded!');

  // Seed Products
  const products = await prisma.product.createMany({
    data: [
      { name: 'Laptop', description: 'High-performance laptop', price: 1500, stock: 10 },
      { name: 'Smartphone', description: 'Latest smartphone', price: 800, stock: 20 },
      { name: 'Headphones', description: 'Noise-cancelling headphones', price: 200, stock: 15 },
      { name: 'Smartwatch', description: 'Feature-packed smartwatch', price: 300, stock: 25 },
      { name: 'Tablet', description: 'Lightweight and powerful tablet', price: 600, stock: 12 },
    ],
  });

  console.log('Products seeded!');

  // Seed Orders
  const orders = await prisma.order.createMany({
    data: [
      { userId: 1, status: 'PLACED' },
      { userId: 2, status: 'PACKED' },
      { userId: 3, status: 'SHIPPED' },
      { userId: 4, status: 'DELIVERED' },
      { userId: 5, status: 'PLACED' },
    ],
  });

  console.log('Orders seeded!');

  // Seed OrderItems
  const orderItems = await prisma.orderItem.createMany({
    data: [
      { orderId: 1, productId: 1, quantity: 1, price: 1500 },
      { orderId: 2, productId: 2, quantity: 2, price: 1600 },
      { orderId: 3, productId: 3, quantity: 3, price: 600 },
      { orderId: 4, productId: 4, quantity: 1, price: 300 },
      { orderId: 5, productId: 5, quantity: 2, price: 1200 },
    ],
  });

  console.log('OrderItems seeded!');
}

main()
  .then(() => {
    console.log('Seeding completed successfully!');
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
