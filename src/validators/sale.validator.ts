import { z } from "zod";

export const createSaleSchema = z.object({
  productId: z.string().uuid("Invalid Product ID"),
  shopId: z.string().uuid("Invalid Shop ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
