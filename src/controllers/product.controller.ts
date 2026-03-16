import { Request, Response } from "express";
import { addProductSchema } from "../validators/product.validator";
import { ProductService } from "../services/product.service";

interface AuthRequest extends Request {
  user: {
    userId: string;
    role: any;
  };
}

export class ProductController {
  static async create(req: Request, res: Response) {
    const validation = addProductSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      const authReq = req as unknown as AuthRequest;
      const ownerId = authReq.user.userId;

      const product = await ProductService.addProduct(validation.data, ownerId);
      return res.status(201).json(product);
    } catch (error) {
      console.error("Product Creation Error:", error);
      return res.status(500).json({ error: "Failed to add product" });
    }
  }

  static async getInventory(req: Request, res: Response) {
    try {
      // const { ownerId } = req.query;
      // if (!ownerId || typeof ownerId !== "string") {
      //   return res.status(400).json({ error: "owner Id is required" });
      // }
      const authReq = req as unknown as AuthRequest;

      if (!authReq.user) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No user found in request" });
      }

      const ownerId = authReq.user.userId;
      const inventory = await ProductService.getShopInventory(ownerId);
      return res.status(200).json(inventory);
    } catch (error: any) {
      console.log("Inventory fetch error", error);
      return res.status(500).json({ error: "Failed to fetch the inventory" });
    }
  }
}
