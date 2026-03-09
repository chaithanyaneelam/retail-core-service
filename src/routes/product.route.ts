import { Router, Request, Response } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  ProductController.create(req, res);
});

export default router;
