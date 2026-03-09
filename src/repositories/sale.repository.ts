import { prisma } from "../lib/prisma";

export class SaleRepository {
  static async create(data: {
    productId: string;
    quantity: number;
    shopId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Check stock first
      const product = await tx.product.findUnique({
        where: { id: data.productId },
      });

      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (product.stock < data.quantity) throw new Error("INSUFFICIENT_STOCK");

      // 2. Create Sale Record
      const sale = await tx.sale.create({
        data: {
          productId: data.productId,
          shopId: data.shopId,
          quantity: data.quantity,
          totalAmount: Number(product.price) * data.quantity,
        },
      });

      // 3. Decrement Stock
      await tx.product.update({
        where: { id: data.productId },
        data: { stock: { decrement: data.quantity } },
      });

      return sale;
    });
  }
}
