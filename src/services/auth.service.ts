import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";
import { RegisterOwnerInput, LoginInput } from "../validators/auth.validator";

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

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) return null;

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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
}
