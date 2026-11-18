import { prisma } from "./src/db";

async function main() {
  try {
    const count = await prisma.user.count();
    console.log("DATABASE SUCCESS:", count, "users");
  } catch (error) {
    console.error("DATABASE ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
