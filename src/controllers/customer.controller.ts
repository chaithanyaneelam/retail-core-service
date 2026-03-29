import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { error } from "node:console";
import { success } from "zod";
import { AuthRequest } from "../middleware/auth.middleware";

export class CustomerController {
  static async getNearby(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      const shops = await CustomerService.getNearbyShopsForUser(userId);

      return res.status(200).json({
        success: true,
        shops,
      });
    } catch (error: any) {
      if (error.message === "NO_SHOPS_FOUND") {
        return res
          .status(404)
          .json({ message: "No shops available within 10km radius" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
