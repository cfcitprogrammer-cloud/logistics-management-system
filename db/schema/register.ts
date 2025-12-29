import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").max(200, "Limit Reached"),
  email: z.email().nonempty("Email is required").max(200, "Limit Reached"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Minimum of 6 characters")
    .max(100, "Limit Reached"),
});
