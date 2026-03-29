import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/nearby", authenticate, CustomerController.getNearby);

export default router;
