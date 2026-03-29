import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

interface AuthRequest extends Request {
  user: { userId: string; role: any };
}

export class DashboardController {
  static async getOverview(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthRequest;
      const stats = await DashboardService.getStats(authReq.user.userId);
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  }
}
