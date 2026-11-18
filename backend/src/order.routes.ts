
import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./db";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing.");
}

type AuthRequest = Request & {
  userId?: string;
};

type OrderInput = {
  id: number;
  size: string;
  quantity: number;
};

function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Please log in to place or view orders.",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      authorization.slice(7),
      JWT_SECRET!
    );

    if (
      typeof payload !== "object" ||
      typeof payload.userId !== "string"
    ) {
      throw new Error("Invalid token.");
    }

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });
  }
}

// GET /api/orders
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load your orders.",
    });
  }
});

// POST /api/orders
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { items, customer } = req.body ?? {};

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50
    ) {
      res.status(400).json({
        success: false,
        message: "Your order must contain valid items.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId!,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Account not found. Please log in again.",
      });
      return;
    }

    if (
      !customer ||
      typeof customer.email !== "string" ||
      customer.email.trim().toLowerCase() !== user.email.toLowerCase()
    ) {
      res.status(400).json({
        success: false,
        message: "Checkout email must match your account email.",
      });
      return;
    }

    const validatedItems: OrderInput[] = [];

    for (const item of items) {
      if (
        !item ||
        !Number.isSafeInteger(item.id) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20 ||
        typeof item.size !== "string" ||
        item.size.trim().length === 0
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid product, size or quantity.",
        });
        return;
      }

      validatedItems.push({
        id: item.id,
        size: item.size.trim(),
        quantity: item.quantity,
      });
    }

    const productIds = [
      ...new Set(validatedItems.map((item) => item.id)),
    ];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({
        success: false,
        message: "One or more products are unavailable.",
      });
      return;
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    const quantitiesByProduct = new Map<number, number>();
    const quantitiesByVariant = new Map<string, OrderInput>();

    for (const item of validatedItems) {
      const product = productMap.get(item.id)!;

      let availableSizes: unknown;

      try {
        availableSizes = JSON.parse(product.sizes);
      } catch {
        res.status(400).json({
          success: false,
          message: `Invalid size configuration for ${product.name}.`,
        });
        return;
      }

      if (
        !Array.isArray(availableSizes) ||
        !availableSizes.includes(item.size)
      ) {
        res.status(400).json({
          success: false,
          message: `Invalid size for ${product.name}.`,
        });
        return;
      }

      const totalQuantity =
        (quantitiesByProduct.get(item.id) ?? 0) +
        item.quantity;

      if (totalQuantity > product.stock) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
        return;
      }

      quantitiesByProduct.set(item.id, totalQuantity);

      const variantKey = JSON.stringify([item.id, item.size]);
      const existing = quantitiesByVariant.get(variantKey);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        quantitiesByVariant.set(variantKey, { ...item });
      }
    }

    const normalizedItems = [...quantitiesByVariant.values()];

    const subtotal = normalizedItems.reduce(
      (sum, item) => {
        const product = productMap.get(item.id)!;
        return sum + product.price * item.quantity;
      },
      0
    );

    const shipping = subtotal >= 1999 ? 0 : 99;
    const total = subtotal + shipping;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "DEMO_PLACED",
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.id,
            size: item.size,
            quantity: item.quantity,
            price: productMap.get(item.id)!.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      order,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Could not save your order. Please try again.",
    });
  }
});

export default router;
