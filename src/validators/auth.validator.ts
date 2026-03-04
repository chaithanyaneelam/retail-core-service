import { email, z } from "zod";

export const registerOwnerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  lat: z.number().min(-90).max(90, "Invalid latitude"),
  lng: z.number().min(-180).max(180, "Invalid longitude"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
