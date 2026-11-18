
import fs from "node:fs";
import path from "node:path";
import { prisma } from "./src/db";

type CatalogProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes?: string[];
};

function extractProducts(source: string): CatalogProduct[] {
  const start = source.indexOf("const products: Product[] = [");

  if (start === -1) {
    throw new Error("Product catalog declaration not found.");
  }

  const arrayStart = source.indexOf("[", source.indexOf("=", start));

  if (arrayStart === -1) {
    throw new Error("Product catalog array not found.");
  }

  let depth = 0;
  let arrayEnd = -1;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = arrayStart; i < source.length; i++) {
    const char = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "[") depth++;

    if (char === "]") {
      depth--;

      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }

  if (arrayEnd === -1) {
    throw new Error("Product catalog array is incomplete.");
  }

  const catalogText = source.slice(arrayStart, arrayEnd + 1);

  const objectMatches = catalogText.match(
    /\{\s*id:\s*\d+,[\s\S]*?\}/g
  );

  if (!objectMatches) {
    throw new Error("No product objects found.");
  }

  const products: CatalogProduct[] = [];

  for (const objectText of objectMatches) {
    const getNumber = (key: string): number => {
      const match = objectText.match(
        new RegExp(`\\b${key}:\\s*(\\d+)`)
      );

      if (!match) {
        throw new Error(`Missing numeric field: ${key}`);
      }

      return Number(match[1]);
    };

    const getString = (key: string): string => {
      const match = objectText.match(
        new RegExp(
          `\\b${key}:\\s*"([^"]*)"`
        )
      );

      if (!match) {
        throw new Error(`Missing string field: ${key}`);
      }

      return match[1];
    };

    const descriptionMatch = objectText.match(
      /description:\s*(?:\r?\n\s*)?"([^"]*)"/
    );

    if (!descriptionMatch) {
      throw new Error("Product description not found.");
    }

    const sizesMatch = objectText.match(
      /sizes:\s*\[([^\]]*)\]/
    );

    const sizes = sizesMatch
      ? Array.from(
          sizesMatch[1].matchAll(/"([^"]+)"/g),
          (match) => match[1]
        )
      : undefined;

    products.push({
      id: getNumber("id"),
      name: getString("name"),
      category: getString("category"),
      price: getNumber("price"),
      image: getString("image"),
      description: descriptionMatch[1],
      sizes,
    });
  }

  return products;
}

async function main() {
  const filePath = path.resolve(
    "../frontend/src/ProductDetails.tsx"
  );

  const source = fs.readFileSync(filePath, "utf8");
  const products = extractProducts(source);

  if (products.length !== 24) {
    throw new Error(
      `Expected 24 products, found ${products.length}. No database changes made.`
    );
  }

  const ids = new Set(products.map((product) => product.id));

  if (ids.size !== 24) {
    throw new Error(
      "Duplicate product IDs found. No database changes made."
    );
  }

  for (const product of products) {
    if (
      !Number.isInteger(product.id) ||
      !Number.isInteger(product.price) ||
      product.price <= 0 ||
      !product.name ||
      !product.description ||
      !product.image
    ) {
      throw new Error(
        `Invalid product: ${JSON.stringify(product)}`
      );
    }
  }

  console.log("Validated 24 products.");

  await prisma.$transaction(
    products.map((product) => {
      const collection =
        product.id < 100
          ? "MEN"
          : product.id < 200
            ? "WOMEN"
            : "ACCESSORIES";

      const sizes =
        product.sizes ??
        (collection === "MEN"
          ? ["S", "M", "L", "XL"]
          : collection === "WOMEN"
            ? ["XS", "S", "M", "L", "XL"]
            : ["ONE SIZE"]);

      return prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          name: product.name,
          slug: `ascend-${product.id}`,
          description: product.description,
          category: collection,
          price: product.price,
          imageUrl: product.image,
          sizes: JSON.stringify(sizes),
          stock: 20,
        },
      });
    })
  );

  console.log(
    `Successfully synchronized ${products.length} products.`
  );
}

main()
  .catch((error) => {
    console.error("Product seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
