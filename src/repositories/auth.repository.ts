import { prisma } from "../lib/prisma";
import { User, Role } from "@prisma/client";

export class AuthRepository {
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async createOwnerWithShop(data: {
    email: string;
    passwordHash: string;
    name: string;
    shopName: string;
    lat: number;
    lng: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.passwordHash,
          role: "OWNER" as Role,
        },
      });

      await tx.$executeRaw`
        INSERT INTO "Shop" ("id", "name", "ownerId", "location", "updatedAt")
        VALUES (
          gen_random_uuid(), 
          ${data.shopName}, 
          ${user.id}::uuid, 
          ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)::geography,
          NOW()
        )
      `;

      return user;
    });
  }

  static async update(userId: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async createCustomer(data: any) {
    const result = await prisma.$queryRaw<any[]>`
    INSERT INTO "User" (id, email, name, password, "phoneNumber", role, location, "updatedAt")
      VALUES (
        gen_random_uuid(), 
        ${data.email}, 
        ${data.name}, 
        ${data.passwordHash}, 
        ${data.phoneNumber}, 
        'CUSTOMER'::"Role",
        ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)::geography,
        NOW()
      )
      RETURNING id,role;
    `;
    return result[0];
  }
}
