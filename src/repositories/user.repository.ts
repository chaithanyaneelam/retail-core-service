import { prisma } from "../lib/prisma";

export class UserRepository {
  static async findLocationByUserId(userId: string) {
    const result = await prisma.$queryRaw<any[]>`
      SELECT 
        ST_X(location::geometry) as lng, 
        ST_Y(location::geometry) as lat 
      FROM "User" 
      WHERE id = ${userId}::uuid
    `;

    return result[0];
  }
}
