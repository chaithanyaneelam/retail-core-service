import { prisma } from "../lib/prisma";

export class ShopRepository {
  static async findByOwnerId(ownerId: string) {
    return await prisma.shop.findFirst({
      where: { ownerId },
    });
  }
}
