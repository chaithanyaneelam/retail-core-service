import { Request, Response } from "express";
import { addProductSchema } from "../validators/product.validator";
import { ProductService } from "../services/product.service";

export class ProductController {
  static async create(req: Request, res: Response) {
    const validation = addProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      const product = await ProductService.addProduct(validation.data);
      return res.status(201).json(product);
    } catch (error) {
      console.error("Product Creation Error:", error);
      return res.status(500).json({ error: "Failed to add product" });
    }
  }
}
