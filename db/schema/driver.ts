import * as z from "zod";

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().optional(),
});
