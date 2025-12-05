import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
