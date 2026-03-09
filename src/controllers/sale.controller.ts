import { Request, Response } from "express";
import { createSaleSchema } from "../validators/sale.validator";
import { SaleService } from "../services/sale.service";

export class SaleController {
  static async create(req: Request, res: Response) {
    const validation = createSaleSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      const sale = await SaleService.processSale(validation.data);
      return res.status(201).json({ message: "Sale completed", sale });
    } catch (error: any) {
      if (error.message === "INSUFFICIENT_STOCK") {
        return res.status(400).json({ error: "Not enough items in stock" });
      }
      return res.status(500).json({ error: "Sale failed" });
    }
  }
}
