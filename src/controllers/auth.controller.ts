import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  registerOwnerSchema,
  loginSchema,
  registerCustomerSchema,
} from "../validators/auth.validator";

export class AuthController {
  static async registerOwner(req: Request, res: Response) {
    const validation = registerOwnerSchema.parse(req.body);

    try {
      const result = await AuthService.registerNewOwner(validation);

      return res.status(201).json({
        message: "Owner and Shop registered successfully",
        ...result,
      });
    } catch (error: any) {
      if (error.message === "EMAIL_EXISTS") {
        return res
          .status(400)
          .json({ error: "An account with this email already exists." });
      } else if (error.message === "ZodError") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ error: "Registration failed." });
    }
  }

  static async loginOwner(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);

    try {
      const tokens = await AuthService.authenticateUser(validatedData);

      if (!tokens) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      return res.status(200).json({ message: "Login successful", ...tokens });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(401).json({ error: error.message });
    }
  }

  static async registerCustomer(req: Request, res: Response) {
    try {
      const validatedData = registerCustomerSchema.parse(req.body);
      const result = await AuthService.registerCustomer(validatedData);

      return res.status(201).json({ message: "Customer Created!", ...result });
    } catch (error: any) {
      if (error.name === "ZodError")
        return res.status(400).json({ errors: error.errors });
      return res.status(400).json({ error: error.message });
    }
  }

  static async loginCustomer(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);
    try {
      const result = await AuthService.loginCustomer(validatedData);

      return res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ errors: error.errors });
      }
      const status = error.message === "INVALID_CREDENTIALS" ? 401 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}
