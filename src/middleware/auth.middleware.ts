import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: any;
  };
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Get token from header (Format: Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
      role: any;
    };

    // 3. Attach user data to request object
    (req as AuthRequest).user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); // Move to the controller
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};
