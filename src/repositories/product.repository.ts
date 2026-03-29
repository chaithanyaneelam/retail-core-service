import { prisma } from "../lib/prisma";
import { Product } from "@prisma/client";

export class ProductRepository {
  static async create(data: {
    name: string;
    description?: string | undefined;
    price: string;
    stock: number;
    shopId: string;
  }) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        shopId: data.shopId,
      },
    });
  }

  static async getByShopId(shopId: string) {
    return await prisma.product.findMany({
      where: { shopId },
      orderBy: { updatedAt: "desc" },
    });
  }

  static async update(
    id: string,
    shopId: string,
    data: { name?: string; price?: string },
  ) {
    return await prisma.product.update({
      where: { id, shopId },
      data,
    });
  }

  static async delete(id: string, shopId: string) {
    return await prisma.product.delete({
      where: { id, shopId },
    });
  }
}
