import { Router } from "express";
import { SaleController } from "../controllers/sale.controller";

const router = Router();

// Endpoint: POST /api/sales
router.post("/", (req, res) => {
  SaleController.create(req, res);
});

export default router;
