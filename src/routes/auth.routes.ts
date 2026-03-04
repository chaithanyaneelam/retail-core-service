import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/register-owner", AuthController.registerOwner);
router.post("/login", (req: Request, res: Response) => {
  AuthController.login(req, res);
});

export default router;
