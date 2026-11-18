
import { prisma } from "./src/db";

async function main() {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: [2, 102, 201, 202],
        },
      },
      select: {
        id: true,
        name: true,
        sizes: true,
        stock: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    console.table(products);
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
