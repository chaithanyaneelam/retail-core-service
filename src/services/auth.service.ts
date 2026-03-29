import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";
import {
  RegisterOwnerInput,
  LoginInput,
  RegisterCustomerInput,
} from "../validators/auth.validator";
import { da } from "zod/v4/locales";
import { custom } from "zod";

export class AuthService {
  static async registerNewOwner(data: RegisterOwnerInput) {
    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) throw new Error("EMAIL_EXISTS");

    const passwordHash = await argon2.hash(data.password);

    const user = await AuthRepository.createOwnerWithShop({
      ...data,
      passwordHash,
    });

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, userId: user.id };
  }

  static async authenticateUser(data: LoginInput) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) return null;
    if (user.role !== "OWNER") throw new Error("NOT_AN_OWNER_ACCOUNT");

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) return null;

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, userId: user.id, name: user.name };
  }

  static generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  static async updateRefreshToken(userId: string, token: string | null) {
    const hashedToken = token ? await argon2.hash(token) : null;
    await AuthRepository.update(userId, { refreshToken: hashedToken });
  }

  static async registerCustomer(data: RegisterCustomerInput) {
    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) throw new Error("EMAIL_EXISTS");

    const passwordHash = await argon2.hash(data.password);

    const user = await AuthRepository.createCustomer({
      ...data,
      passwordHash,
    });

    const tokens = this.generateTokens(user.id, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, userId: user.id };
  }

  static async loginCustomer(data: LoginInput) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    if (user.role !== "CUSTOMER") throw new Error("NOT_A_CUSTOMER_ACCOUNT");

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) throw Error("INVALID_CREDENTIALS");

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
      userId: user.id,
      name: user.name,
    };
  }
}
