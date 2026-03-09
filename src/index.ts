import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.route";
import saleRoutes from "./routes/sale.route";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

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
