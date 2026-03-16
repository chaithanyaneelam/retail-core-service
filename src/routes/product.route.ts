import { Router, Request, Response } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, (req: Request, res: Response) => {
  ProductController.create(req, res);
});

router.get("/inventory", authenticate, (req: Request, res: Response) => {
  ProductController.getInventory(req, res);
});

export default router;
