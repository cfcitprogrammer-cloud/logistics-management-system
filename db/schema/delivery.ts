import { z } from "zod";

export const newDeliverySchema = z.object({
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To / Delivery address is required"),
  fromLat: z.number(),
  fromLng: z.number(),
  toLat: z.number(),
  toLng: z.number(),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  trackingId: z.string(),
  courier: z.string().min(1, "Courier is required"),
});

export type NewDeliveryFormValues = z.infer<typeof newDeliverySchema>;
