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
}
