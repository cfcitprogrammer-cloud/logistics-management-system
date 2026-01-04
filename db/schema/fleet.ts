import * as z from "zod";

export const fleetSchema = z.object({
  plateNumber: z.string().min(1, "Plate Number is required"),
  model: z.string().min(1, "Model is required"),
  loadCapacity: z.string(),
  remarks: z.string().optional(),
});
