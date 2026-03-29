import { prisma } from "../lib/prisma";

export class ShopRepository {
  static async findByOwnerId(ownerId: string) {
    return await prisma.shop.findFirst({
      where: { ownerId },
    });
  }

  static async findNearby(lat: number, lng: number) {
    const radius = 10000;
    return await prisma.$queryRaw<any[]>`
    SELECT 
          id, 
          name, 
          "ownerId",
          "phoneNumber",
          ROUND((ST_Distance(location, ST_MakePoint(${lng}, ${lat})::geography) / 1000)::numeric, 2) as distance_km
        FROM "Shop"
        WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radius})
        ORDER BY distance_km ASC;
      `;
  }
}
