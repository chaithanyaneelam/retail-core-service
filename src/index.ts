import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// CORS allows your Flutter/React apps to talk to this API
app.use(cors());

// Professional body-parsing with a size limit to prevent DOS attacks
app.use(express.json({ limit: "10kb" }));

// --- Routes ---
// We prefix auth routes for a clean API structure
app.use("/api/auth", authRoutes);

// Health Check: Standard for professional monitoring
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "active", timestamp: new Date().toISOString() });
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
