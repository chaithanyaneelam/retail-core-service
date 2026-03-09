import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"), //
  shopId: z.string().uuid("Invalid Shop ID format"),
});
export type AddProductInput = z.infer<typeof addProductSchema>;
