import { Request, Response } from "express";
import { createSaleSchema } from "../validators/sale.validator";
import { SaleService } from "../services/sale.service";

interface AuthRequest extends Request {
  user: {
    userId: string;
    role: any;
  };
}

export class SaleController {
  static async create(req: Request, res: Response) {
    const validation = createSaleSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      const authReq = req as unknown as AuthRequest;
      const ownerId = authReq.user.userId;
      const sale = await SaleService.processSale(validation.data, ownerId);
      return res.status(201).json({ message: "Sale completed", sale });
    } catch (error: any) {
      if (error.message === "INSUFFICIENT_STOCK") {
        return res.status(400).json({ error: "Not enough items in stock" });
      }
      return res.status(500).json({ error: "Sale failed" });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthRequest;
      const ownerId = authReq.user.userId;

      const history = await SaleService.getShopSaleHistory(ownerId);
      return res.status(200).json(history);
    } catch (error: any) {
      console.error("Sale History Error:", error);
      return res.status(500).json({ error: "Failed to fetch sale history" });
    }
  }
}
