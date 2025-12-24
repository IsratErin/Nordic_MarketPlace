import prisma from '../src/prisma/client.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');

  // --- Categories
  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {}, // do nothing if already exists
      create: { name },
    });
  }
  console.log('Categories seeded!');

  // --- Users ---
  const users = [
    { email: 'admin@example.com', password: 'password123' },
    { email: 'alice@example.com', password: 'alice123' },
    { email: 'bob@example.com', password: 'bob123' },
    { email: 'carol@example.com', password: 'carol123' },
    { email: 'dave@example.com', password: 'dave123' },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: user.email,
          password: await bcrypt.hash(user.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10),
        },
      });
    }
  }
  console.log('Users seeded!');

  // --- Products ---
  const products = [
    {
      name: 'Laptop',
      description: 'High-end laptop',
      price: 1200,
      stock: 10,
      categoryName: 'Electronics',
    },
    {
      name: 'Smartphone',
      description: 'Latest smartphone',
      price: 800,
      stock: 20,
      categoryName: 'Electronics',
    },
    { name: 'Novel', description: 'Interesting book', price: 15, stock: 50, categoryName: 'Books' },
    {
      name: 'T-Shirt',
      description: 'Cotton t-shirt',
      price: 20,
      stock: 100,
      categoryName: 'Clothing',
    },
    {
      name: 'Sofa',
      description: 'Comfortable home sofa',
      price: 500,
      stock: 5,
      categoryName: 'Home',
    },
    {
      name: 'Action Figure',
      description: 'Toy for kids',
      price: 25,
      stock: 30,
      categoryName: 'Toys',
    },
    {
      name: 'Board Game',
      description: 'Fun family game',
      price: 40,
      stock: 20,
      categoryName: 'Toys',
    },
    {
      name: 'Coffee Table',
      description: 'Wooden table',
      price: 150,
      stock: 7,
      categoryName: 'Home',
    },
    { name: 'Jeans', description: 'Denim pants', price: 45, stock: 50, categoryName: 'Clothing' },
    {
      name: 'Textbook',
      description: 'Educational book',
      price: 60,
      stock: 25,
      categoryName: 'Books',
    },
  ];

  for (const product of products) {
    const category = await prisma.category.findUnique({ where: { name: product.categoryName } });
    if (!category) continue;

    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: category.id,
        },
      });
    }
  }
  console.log('Products seeded!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
