import { z } from "zod";

export const newDeliverySchema = z.object({
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  trackingId: z.string().min(1, "Delivery date is required"),
});

export type NewDeliveryFormValues = z.infer<typeof newDeliverySchema>;
