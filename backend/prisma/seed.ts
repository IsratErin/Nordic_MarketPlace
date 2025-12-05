import "dotenv/config";

import prisma from "./client.js";

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.order.deleteMany();
  await prisma.orderItem.deleteMany();

  // Seed initial products
  await prisma.product.createMany({
    data: [
      {
        name: "Laptop",
        description: "Powerful laptop",
        price: 1200,
        stock: 10,
      },
      {
        name: "Smartphone",
        description: "Latest phone",
        price: 800,
        stock: 20,
      },
      {
        name: "Headphones",
        description: "Noise-cancelling",
        price: 200,
        stock: 15,
      },
    ],
  });

  console.log("Seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
