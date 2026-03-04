import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerOwnerSchema, loginSchema } from "../validators/auth.validator";

export class AuthController {
  static async registerOwner(req: Request, res: Response) {
    const validation = registerOwnerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.format(),
      });
    }

    try {
      const result = await AuthService.registerNewOwner(validation.data);

      return res.status(201).json({
        message: "Owner and Shop registered successfully",
        ...result,
      });
    } catch (error: any) {
      if (error.message === "EMAIL_EXISTS") {
        return res
          .status(400)
          .json({ error: "An account with this email already exists." });
      }

      console.error("Registration Error:", error);
      return res.status(500).json({ error: "Registration failed." });
    }
  }

  /**
   * Login logic using Service/Repository delegation
   */
  static async login(req: Request, res: Response) {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      // Delegate credentials check to service
      const tokens = await AuthService.authenticateUser(validation.data);

      if (!tokens) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      return res.status(200).json({ message: "Login successful", ...tokens });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Login failed." });
    }
  }
}
