import { Router } from "express";
import { SaleController } from "../controllers/sale.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Endpoint: POST /api/sales
router.post("/", authenticate, (req, res) => {
  SaleController.create(req, res);
});

router.get("/history", authenticate, (req, res) => {
  SaleController.getHistory(req, res);
});

export default router;
